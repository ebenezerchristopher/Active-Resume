import { Resolver, Query } from "@nestjs/graphql";
import { ContributorsService } from "./contributors.service";
import { ContributorEntity } from "./entities/contributors.entity";

@Resolver()
export class ContributorsResolver {
  constructor(private readonly contributorsService: ContributorsService) {}

  @Query(() => [ContributorEntity], { name: "github" })
  async githubContributors() {
    return this.contributorsService.fetchGitHubContributors();
  }

  @Query(() => [ContributorEntity], { name: "crowdin" })
  async crowdinContributors() {
    return this.contributorsService.fetchCrowdinContributors();
  }
}
