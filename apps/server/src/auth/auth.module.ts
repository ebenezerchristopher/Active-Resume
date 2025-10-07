import { DynamicModule, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { UserModule } from "../user/user.module";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { RefreshStrategy } from "./strategy/refresh.strategy";
import { TwoFactorStrategy } from "./strategy/two-factor.strategy";
import { MailModule } from "../mail/mail.module";
import { AuthController } from "./auth.controller";
import { GoogleStrategy } from "./strategy/google.strategy";
import { ConfigService } from "@nestjs/config";
import { UserService } from "@server/user/user.service";
import { Config } from "@server/config/schema";
import { DummyStrategy } from "./strategy/dummy.strategy";

@Module({})
export class AuthModule {
  static register(): DynamicModule {
    return {
      module: AuthModule,
      imports: [PassportModule, JwtModule, UserModule, MailModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        AuthResolver,
        LocalStrategy,
        JwtStrategy,
        RefreshStrategy,
        TwoFactorStrategy,
        {
          provide: GoogleStrategy,
          inject: [ConfigService, UserService],
          useFactory: (configService: ConfigService<Config>, userService: UserService) => {
            try {
              const clientID = configService.getOrThrow("GOOGLE_CLIENT_ID");
              const clientSecret = configService.getOrThrow("GOOGLE_CLIENT_SECRET");
              const callbackURL = configService.getOrThrow("GOOGLE_CALLBACK_URL");

              return new GoogleStrategy(clientID, clientSecret, callbackURL, userService);
            } catch {
              return new DummyStrategy();
            }
          },
        },
      ],
      exports: [AuthService],
    };
  }
}
