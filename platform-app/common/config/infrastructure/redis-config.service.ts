export class RedisConfigService {
  constructor() {}

  public getHost() {
    return process.env.REDIS_HOST;
  }

  public getPort() {
    return Number(process.env.REDIS_PORT);
  }

  public getTTL() {
    return Number(process.env.REDIS_TTL);
  }
}

const redisConfigService = new RedisConfigService();

export { redisConfigService };
