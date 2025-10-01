import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AuthProvidersDto, LoginDto, RegisterDto, UserWithSecrets } from "@active-resume/dto";
import { ErrorMessage } from "@active-resume/utils";
import * as bcryptjs from "bcryptjs";
//import { Response } from "express";

import { Config } from "../config/schema";
// MailService will be used in a later ticket for email verification
// import { MailService } from "../mail/mail.service";
import { UserService } from "../user/user.service";
//import { getCookieOptions } from "./utils/cookie";
import { Payload } from "./utils/payload";
import { randomBytes } from "node:crypto";
import { MailService } from "../mail/mail.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private hash(password: string): Promise<string> {
    return bcryptjs.hash(password, 10);
  }

  private compare(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  }

  private async validatePassword(password: string, hashedPassword: string) {
    const isValid = await this.compare(password, hashedPassword);

    if (!isValid) {
      throw new BadRequestException(ErrorMessage.InvalidCredentials);
    }
  }

  generateToken(grantType: "access" | "refresh" | "reset" | "verification", payload?: Payload) {
    switch (grantType) {
      case "access": {
        return this.jwtService.sign(payload, {
          secret: this.configService.getOrThrow("ACCESS_TOKEN_SECRET"),
          expiresIn: "15m",
        });
      }
      case "refresh": {
        return this.jwtService.sign(payload, {
          secret: this.configService.getOrThrow("REFRESH_TOKEN_SECRET"),
          expiresIn: "2d",
        });
      }

      case "reset":
      case "verification": {
        return randomBytes(32).toString("base64url");
      }
    }
  }

  async setLastSignedIn(email: string) {
    await this.userService.updateByEmail(email, {
      secrets: { update: { lastSignedIn: new Date() } },
    });
  }

  async authenticate({ identifier, password }: LoginDto) {
    try {
      const user = await this.userService.findOneByIdentifierOrThrow(identifier);

      if (!user.secrets?.password) {
        throw new BadRequestException(ErrorMessage.OAuthUser);
      }

      await this.validatePassword(password, user.secrets.password);
      await this.setLastSignedIn(user.email);

      return user;
    } catch {
      throw new BadRequestException(ErrorMessage.InvalidCredentials);
    }
  }

  async setRefreshToken(email: string, token: string | null) {
    await this.userService.updateByEmail(email, {
      secrets: {
        update: {
          refreshToken: token,
          lastSignedIn: token ? new Date() : undefined,
        },
      },
    });
  }

  async validateRefreshToken(payload: Payload, token: string) {
    const user = await this.userService.findOneById(payload.id);
    const storedRefreshToken = user.secrets?.refreshToken;

    if (!storedRefreshToken || storedRefreshToken !== token) throw new ForbiddenException();

    if (!user.twoFactorEnabled) return user;

    if (payload.isTwoFactorAuth) return user;
  }

  async register(registerDto: RegisterDto): Promise<UserWithSecrets> {
    const hashedPassword = await this.hash(registerDto.password);

    try {
      const user = await this.userService.create({
        name: registerDto.name,
        email: registerDto.email,
        username: registerDto.username,
        locale: registerDto.locale,
        provider: "email",
        emailVerified: false,
        secrets: { create: { password: hashedPassword } },
      });

      // Email verification will be implemented in a later sprint
      // void this.sendVerificationEmail(user.email);

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new BadRequestException(ErrorMessage.UserAlreadyExists);
      }

      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  getAuthProviders() {
    const providers: AuthProvidersDto = [];

    if (!this.configService.get("DISABLE_EMAIL_AUTH")) {
      providers.push("email");
    }

    if (
      this.configService.get("GITHUB_CLIENT_ID") &&
      this.configService.get("GITHUB_CLIENT_SECRET") &&
      this.configService.get("GITHUB_CALLBACK_URL")
    ) {
      providers.push("github");
    }

    if (
      this.configService.get("GOOGLE_CLIENT_ID") &&
      this.configService.get("GOOGLE_CLIENT_SECRET") &&
      this.configService.get("GOOGLE_CALLBACK_URL")
    ) {
      providers.push("google");
    }

    if (
      this.configService.get("OPENID_AUTHORIZATION_URL") &&
      this.configService.get("OPENID_CALLBACK_URL") &&
      this.configService.get("OPENID_CLIENT_ID") &&
      this.configService.get("OPENID_CLIENT_SECRET") &&
      this.configService.get("OPENID_ISSUER") &&
      this.configService.get("OPENID_SCOPE") &&
      this.configService.get("OPENID_TOKEN_URL") &&
      this.configService.get("OPENID_USER_INFO_URL")
    ) {
      providers.push("openid");
    }

    return providers;
  }

  // Password Reset Flows
  async forgotPassword(email: string) {
    const token = this.generateToken("reset");

    await this.userService.updateByEmail(email, {
      secrets: { update: { resetToken: token } },
    });

    const baseUrl = this.configService.get("PUBLIC_URL");
    const url = `${baseUrl}/auth/reset-password?token=${token}`;
    const subject = "Reset your Reactive Resume password";
    const text = `Please click on the link below to reset your password:\n\n${url}`;

    await this.mailService.sendEmail({ to: email, subject, text });
    Logger.log(`Password reset email sent to ${email}`);
  }

  async resetPassword(token: string, password: string) {
    const hashedPassword = await this.hash(password);

    await this.userService.updateByResetToken(token, {
      resetToken: null,
      password: hashedPassword,
    });
  }
}
