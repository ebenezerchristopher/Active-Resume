import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TranslationService } from "./translation.service";
import { TranslationResolver } from "./translation.resolver";

@Module({
  imports: [HttpModule],
  providers: [TranslationService, TranslationResolver],
})
export class TranslationModule {}
