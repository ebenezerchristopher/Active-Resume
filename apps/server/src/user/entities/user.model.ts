import { UserDto } from '@active-resume/dto';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('UserEntity')
export class UserEntity implements UserDto {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  locale: string | null;

  @Field()
  username?: string;

  @Field()
  email?: string;

  @Field()
  emailVerified: boolean;

  @Field()
  twoFactorEnabled: boolean;

  @Field()
  provider: 'email' | 'github' | 'google' | 'openid';

  @Field(() => String, { nullable: true })
  picture?: string | null;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;
}
