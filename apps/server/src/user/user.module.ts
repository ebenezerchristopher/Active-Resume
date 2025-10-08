import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { AuthModule } from "../auth/auth.module";
import { AuthService } from "@server/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "@server/mail/mail.service";

@Module({
  imports: [forwardRef(() => AuthModule.register())],
  providers: [UserService, UserResolver, AuthService, JwtService, MailService],
  exports: [UserService],
})
export class UserModule {}
