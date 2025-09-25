import { AuthProvidersDto } from "@active-resume/dto";
import { Message } from "./../../shared/dto/message.dto";
import { ObjectType, Field, registerEnumType } from "@nestjs/graphql";
import { AuthResponseDto } from "@active-resume/dto";
import { UserEntity } from "@server/user/entities";

@ObjectType()
export class AuthResponse implements AuthResponseDto {
  @Field()
  status: "authenticated" | "2fa_required";

  @Field()
  user: UserEntity;
}

@ObjectType()
export class MessageEntity implements Message {
  @Field()
  message: string;
}

export const AuthProviders = AuthProvidersDto.schema.element.enum;

registerEnumType(AuthProviders, {
  name: "AuthProviders",
  description: "Authentication Providers",
});
