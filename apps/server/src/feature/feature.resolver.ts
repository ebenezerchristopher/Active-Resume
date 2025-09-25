import { Resolver, Query } from "@nestjs/graphql";
import { FeatureService } from "./feature.service";
import { FeatureEntity } from "./entities/entities";

@Resolver()
export class FeatureResolver {
  constructor(private readonly featureService: FeatureService) {}

  @Query(() => FeatureEntity, { name: "featureFlags" })
  async getFeatureFlags() {
    return this.featureService.getFeatures();
  }
}
