import { InputType, Field } from "@nestjs/graphql";
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdatePasswordDto,
  TwoFactorDto,
} from "@active-resume/dto";

@InputType()
export class RegisterInput implements RegisterDto {
  @Field()
  name: string;

  @Field()
  locale: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class LoginInput implements LoginDto {
  @Field()
  identifier: string;

  @Field()
  password: string;
}

@InputType()
export class ForgotPasswordInput implements ForgotPasswordDto {
  @Field()
  email: string;
}

@InputType()
export class ResetPasswordInput implements ResetPasswordDto {
  @Field()
  token: string;

  @Field()
  password: string;
}

@InputType()
export class UpdatePasswordInput implements UpdatePasswordDto {
  @Field()
  currentPassword: string;

  @Field()
  newPassword: string;
}

@InputType()
export class TwoFactorInput implements TwoFactorDto {
  @Field()
  code: string;
}
