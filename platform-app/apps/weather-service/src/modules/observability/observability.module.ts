import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsService } from './metrics.service';
import { weatherTokens } from '../../common';

@Module({
  imports: [PrometheusModule.register({ defaultMetrics: { enabled: false } })],
  providers: [
    MetricsService,
    {
      provide: weatherTokens.METRICS_SERVICE,
      useClass: MetricsService,
    },
  ],
  exports: [weatherTokens.METRICS_SERVICE],
})
export class ObservabilityModule {}
