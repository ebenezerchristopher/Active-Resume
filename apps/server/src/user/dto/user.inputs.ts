import { Field, InputType } from '@nestjs/graphql';
import { UpdateUserDto } from './update-user';

@InputType()
export class UpdateUserInput implements UpdateUserDto {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  locale?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  picture?: string | null;
}
