import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WeatherModule } from './weather/weather.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ObservabilityModule } from './observability/observability.module';
import { MetricsMiddleware } from '../shared/middleware/metrics.middleware';

@Module({
  imports: [ObservabilityModule, WeatherModule, SubscriptionModule],
})
export class ModulesModule implements NestModule {
  configure(metrics: MiddlewareConsumer) {
    metrics.apply(MetricsMiddleware).forRoutes('*path');
  }
}
