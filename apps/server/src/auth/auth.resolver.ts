import { Args, Context, Mutation, Resolver, Query } from "@nestjs/graphql";
import { authResponseSchema, RegisterDto, UserWithSecrets } from "@active-resume/dto";
import { Response } from "express";

import { AuthService } from "./auth.service";
import {
  AuthProviders,
  AuthResponse,
  ForgotPasswordInput,
  LoginInput,
  MessageEntity,
  ResetPasswordInput,
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

  @Query(() => [AuthProviders])
  async providers() {
    return this.authService.getAuthProviders();
  }

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
}
