import { FeatureDto } from "@active-resume/dto";
import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class FeatureEntity implements FeatureDto {
  @Field()
  isSignupsDisabled: boolean;

  @Field()
  isEmailAuthDisabled: boolean;
}
