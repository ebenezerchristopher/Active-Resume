import { InputType, Field } from "@nestjs/graphql";
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from "@active-resume/dto";

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
