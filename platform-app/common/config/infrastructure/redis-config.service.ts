export class RedisConfigService {
  constructor() {}

  public getHost() {
    return process.env.REDIS_HOST;
  }

  public getPort() {
    return Number(process.env.REDIS_PORT);
  }
}

const redisConfigService = new RedisConfigService();

export { redisConfigService };
