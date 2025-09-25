import { Module } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { FeatureResolver } from './feature.resolver';

@Module({
  providers: [FeatureResolver, FeatureService],
})
export class FeatureModule {}
