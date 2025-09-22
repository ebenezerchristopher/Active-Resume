import { Module } from "@nestjs/common";
import { ContributorsResolver } from "./contributors.resolver";
import { ContributorsService } from "./contributors.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [ContributorsResolver, ContributorsService],
})
export class ContributorsModule {}
