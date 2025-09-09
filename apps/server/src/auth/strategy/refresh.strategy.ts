import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';

import { Config } from '@/server/config/schema';

import { Payload } from '../utils/payload';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly authService: AuthService
  ) {
    const extractors = [(request: Request) => request.cookies.Refresh];

    super({
      secretOrKey: configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors(extractors),
      passReqToCallback: true,
      ignoreExpiration: false,
    } as StrategyOptionsWithRequest);
  }

  async validate(request: Request, payload: Payload) {
    const refreshToken = request.cookies.Refresh;

    return this.authService.validateRefreshToken(payload, refreshToken);
  }
}
