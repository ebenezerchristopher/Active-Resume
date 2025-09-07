import { ObjectType, Field } from '@nestjs/graphql';
import { AuthResponseDto } from '@active-resume/dto';
import { UserEntity } from '@/server/user/entities';

@ObjectType()
export class AuthResponse implements AuthResponseDto {
  @Field()
  status: 'authenticated' | '2fa_required';

  @Field()
  user: UserEntity;
}
