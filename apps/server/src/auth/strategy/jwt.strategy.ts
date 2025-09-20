import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';

import { Config } from '@server/config/schema';
import { UserService } from '@server/user/user.service';

import { Payload } from '../utils/payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly userService: UserService
  ) {
    const extractors = [(request: Request) => request.cookies?.Authentication];

    super({
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors(extractors),
      ignoreExpiration: false,
    } as StrategyOptionsWithRequest);
  }

  async validate(payload: Payload) {
    // 2FA logic will be added later. For now, we just validate the user exists.
    return this.userService.findOneById(payload.id);
  }
}
