import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RegisterDto, UserWithSecrets } from '@active-resume/dto';
import { ErrorMessage } from '@active-resume/utils';
import * as bcryptjs from 'bcryptjs';
//import { Response } from "express";

import { Config } from '../config/schema';
// MailService will be used in a later ticket for email verification
// import { MailService } from "../mail/mail.service";
import { UserService } from '../user/user.service';
//import { getCookieOptions } from "./utils/cookie";
import { Payload, payloadSchema } from './utils/payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  private hash(password: string): Promise<string> {
    return bcryptjs.hash(password, 10);
  }

  generateToken(grantType: 'access' | 'refresh', payload: Payload) {
    if (grantType === 'access') {
      return this.jwtService.sign(payload, {
        secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      });
    }
    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
      expiresIn: '2d',
    });
  }

  private async exchangeToken(id: string, email: string) {
    // For now, isTwoFactorAuth is false. This will be updated later.
    const payload = payloadSchema.parse({ id, isTwoFactorAuth: false });
    const accessToken = this.generateToken('access', payload);
    const refreshToken = this.generateToken('refresh', payload);

    await this.setRefreshToken(email, refreshToken);

    return { accessToken, refreshToken };
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

  async register(registerDto: RegisterDto): Promise<UserWithSecrets> {
    const hashedPassword = await this.hash(registerDto.password);

    try {
      const user = await this.userService.create({
        name: registerDto.name,
        email: registerDto.email,
        username: registerDto.username,
        locale: registerDto.locale,
        provider: 'email',
        emailVerified: false,
        secrets: { create: { password: hashedPassword } },
      });

      // Email verification will be implemented in a later sprint
      // void this.sendVerificationEmail(user.email);

      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(ErrorMessage.UserAlreadyExists);
      }

      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
