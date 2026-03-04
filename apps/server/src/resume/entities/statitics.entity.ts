import { StatisticsDto } from "@active-resume/dto";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class StatisticsEntity implements StatisticsDto {
  @Field()
  views: number;
  @Field()
  downloads: number;
}
