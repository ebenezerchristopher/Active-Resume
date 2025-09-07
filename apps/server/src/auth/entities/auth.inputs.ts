import { InputType, Field } from '@nestjs/graphql';
import { RegisterDto } from '@active-resume/dto';

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
