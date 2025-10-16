import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { StorageModule } from "@server/storage/storage.module";

@Module({
  imports: [StorageModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
