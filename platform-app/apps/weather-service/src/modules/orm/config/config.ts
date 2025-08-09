import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { postgresConfigService } from '../../../../../../common/config';

export const typeOrmModuleOptions: PostgresConnectionOptions = {
  type: 'postgres',
  host: postgresConfigService.getHost(),
  port: postgresConfigService.getPort(),
  username: postgresConfigService.getUsername(),
  password: postgresConfigService.getPassword(),
  database: postgresConfigService.getDatabase(),
  synchronize: true,
  logging: false,
};
