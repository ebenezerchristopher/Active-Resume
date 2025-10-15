import { Args, Context, Mutation, Resolver, Query } from "@nestjs/graphql";
import {
  authResponseSchema,
  backupCodesSchema,
  RegisterDto,
  UserWithSecrets,
} from "@active-resume/dto";
import { Request, Response } from "express";

import { AuthService } from "./auth.service";
import {
  AuthProviders,
  AuthResponse,
  BackupCodeEntity,
  ForgotPasswordInput,
  LoginInput,
  MessageEntity,
  ResetPasswordInput,
  TwoFactorInput,
  UpdatePasswordInput,
} from "./entities";
import { RegisterInput } from "./entities";
import { payloadSchema } from "./utils/payload";
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  UseGuards,
} from "@nestjs/common";
import { ErrorMessage } from "@active-resume/utils";
import { ConfigService } from "@nestjs/config";
import { getCookieOptions } from "./utils/cookie";
import { LocalGuard } from "./guards/local.guard";
import { User } from "../user/decorators/user.decorator";
import { RefreshGuard } from "./guards/refresh.guard";
import { TwoFactorGuard } from "./guards/two-factor.guard";
import { Message } from "../shared/dto/message.dto";
import { JwtGuard } from "./guards/jwt.guard";
import { UserEntity } from "@server/user/entities";

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private async exchangeToken(id: string, email: string, isTwoFactorAuth = false) {
    try {
      const payload = payloadSchema.parse({ id, isTwoFactorAuth });

      const accessToken = this.authService.generateToken("access", payload);
      const refreshToken = this.authService.generateToken("refresh", payload);

      // Set Refresh Token in Database
      await this.authService.setRefreshToken(email, refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException(error, ErrorMessage.SomethingWentWrong);
    }
  }

  private async handleAuthenticationResponse(
    user: UserWithSecrets,
    response: Response,
    isTwoFactorAuth = false,
  ) {
    let status = "authenticated";

    const { accessToken, refreshToken } = await this.exchangeToken(
      user.id,
      user.email,
      isTwoFactorAuth,
    );

    response.cookie("Authentication", accessToken, getCookieOptions("access"));
    response.cookie("Refresh", refreshToken, getCookieOptions("refresh"));

    if (user.twoFactorEnabled && !isTwoFactorAuth) status = "2fa_required";

    const responseData = authResponseSchema.parse({ status, user });

    return responseData as AuthResponse;
  }

  // Standard Authentication flows
  @Mutation(() => AuthResponse)
  async register(
    @Args("data") data: RegisterInput,
    @Context() { res }: { res: Response },
  ): Promise<AuthResponse> {
    const user = await this.authService.register(data as RegisterDto);

    return this.handleAuthenticationResponse(user, res);
  }

  @Mutation(() => AuthResponse)
  @UseGuards(LocalGuard)
  async login(
    // `data` is used by the guard via LocalGuard#getRequest
    @Args("data") _data: LoginInput,
    @User() user: UserWithSecrets,
    @Context() { res }: { res: Response },
  ): Promise<AuthResponse> {
    return this.handleAuthenticationResponse(user, res);
  }

  @Mutation(() => AuthResponse)
  @UseGuards(RefreshGuard)
  async refresh(
    @User() user: UserWithSecrets,
    @Context() { res }: { res: Response },
  ): Promise<AuthResponse> {
    return this.handleAuthenticationResponse(user, res, true);
  }

  @Mutation(() => MessageEntity)
  @UseGuards(TwoFactorGuard)
  async logout(
    @User() user: UserWithSecrets,
    @Context() { res }: { res: Response },
  ): Promise<Message> {
    await this.authService.setRefreshToken(user.email, null);

    res.clearCookie("Authentication");
    res.clearCookie("Refresh");

    return { message: "You have been logged out, tschüss!" };
  }

  @Mutation(() => MessageEntity, { name: "password" })
  @UseGuards(TwoFactorGuard)
  async updatePassword(@User("email") email: string, @Args("data") data: UpdatePasswordInput) {
    const { currentPassword, newPassword } = data;
    await this.authService.updatePassword(email, currentPassword, newPassword);

    return { message: "Your password has been successfully updated." };
  }

  @Query(() => [AuthProviders])
  async providers() {
    return this.authService.getAuthProviders();
  }

  // Password Reset flows
  @Mutation(() => MessageEntity)
  async forgotPassword(@Args("data") data: ForgotPasswordInput) {
    try {
      await this.authService.forgotPassword(data.email);
    } catch (e) {
      // pass
      Logger.error(e);
    }

    return {
      message:
        "A password reset link should have been sent to your inbox, if an account existed with the email you provided.",
    };
  }

  @Mutation(() => MessageEntity)
  async resetPassword(@Args("data") data: ResetPasswordInput) {
    try {
      await this.authService.resetPassword(data.token, data.password);

      return { message: "Your password has been successfully reset." };
    } catch {
      throw new BadRequestException(ErrorMessage.InvalidResetToken);
    }
  }

  // Email Verification flows
  @Mutation(() => MessageEntity)
  @UseGuards(TwoFactorGuard)
  async verifyEmail(
    @User("id") id: string,
    @User("emailVerified") emailVerified: boolean,
    @Context() { req }: { req: Request },
  ) {
    const token = req.query.token as string;

    if (!token) throw new BadRequestException(ErrorMessage.InvalidVerificationToken);

    if (emailVerified) {
      throw new BadRequestException(ErrorMessage.EmailAlreadyVerified);
    }

    await this.authService.verifyEmail(id, token);

    return { message: "Your email has been successfully verified." };
  }

  @Mutation(() => MessageEntity, { name: "reverifyEmail" })
  @UseGuards(TwoFactorGuard)
  async resendVerificationEmail(
    @User("email") email: string,
    @User("emailVerified") emailVerified: boolean,
  ) {
    if (emailVerified) {
      throw new BadRequestException(ErrorMessage.EmailAlreadyVerified);
    }

    await this.authService.sendVerificationEmail(email);

    return {
      message: "You should have received a new email with a link to verify your email address.",
    };
  }

  // Two-Factor Authentication flows
  @Mutation(() => MessageEntity, { name: "TwoFaSetup" })
  @UseGuards(JwtGuard)
  async setup2FASecret(@User("email") email: string) {
    return this.authService.setup2FASecret(email);
  }

  @Mutation(() => BackupCodeEntity, { name: "TwoFaEnable" })
  @UseGuards(JwtGuard)
  async enable2FA(
    @User("id") id: string,
    @User("email") email: string,
    @Args("data") data: TwoFactorInput,
    @Context() { res }: { res: Response },
  ) {
    const { code } = data;
    const { backupCodes } = await this.authService.enable2FA(email, code);

    const { accessToken, refreshToken } = await this.exchangeToken(id, email, true);

    res.cookie("Authentication", accessToken, getCookieOptions("access"));
    res.cookie("Refresh", refreshToken, getCookieOptions("refresh"));

    return backupCodesSchema.parse({ backupCodes });
  }

  @Mutation(() => MessageEntity, { name: "TwoFaDisable" })
  @UseGuards(TwoFactorGuard)
  async disable2FA(@User("email") email: string) {
    await this.authService.disable2FA(email);

    return { message: "Two-factor authentication has been successfully disabled on your account." };
  }

  @Mutation(() => AuthResponse, { name: "verifyOtp" })
  @UseGuards(JwtGuard)
  async verify2FACode(
    @User() user: UserEntity,
    @Args("data") data: TwoFactorInput,
    @Context() { res }: { res: Response },
  ): Promise<AuthResponse> {
    const { code } = data;
    await this.authService.verify2FACode(user.email, code);

    return this.handleAuthenticationResponse(user as UserWithSecrets, res, true);
  }
}
