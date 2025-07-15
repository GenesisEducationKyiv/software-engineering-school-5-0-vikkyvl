import * as dotenv from 'dotenv';

dotenv.config();

export class PostgresConfigService {
  constructor() {}

  public getHost() {
    return process.env.DB_HOST;
  }

  public getPort() {
    return Number(process.env.DB_PORT);
  }

  public getUsername() {
    return process.env.DB_USER;
  }

  public getPassword() {
    return process.env.DB_PASSWORD;
  }

  public getDatabase() {
    return process.env.DB_NAME;
  }
}

const postgresConfigService = new PostgresConfigService();

export { postgresConfigService };
