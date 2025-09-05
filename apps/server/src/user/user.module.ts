import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Module({
  providers: [UserService, UserResolver, GqlAuthGuard],
  exports: [UserService],
})
export class UserModule {}
