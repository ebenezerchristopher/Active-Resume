import { Resolver, Query } from "@nestjs/graphql";
import { TranslationService } from "./translation.service";
import { LanguageEntity } from "./entities/translation.entities";

@Resolver()
export class TranslationResolver {
  constructor(private readonly translationService: TranslationService) {}

  @Query(() => [LanguageEntity])
  async languages() {
    return this.translationService.fetchLanguages();
  }
}
