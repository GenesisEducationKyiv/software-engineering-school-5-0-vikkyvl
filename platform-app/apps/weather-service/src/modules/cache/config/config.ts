import { redisConfigService } from '../../../../../../common/config';

export const redisConfig = {
  host: redisConfigService.getHost(),
  port: redisConfigService.getPort(),
};

export const redisExpiry = redisConfigService.getTTL();
