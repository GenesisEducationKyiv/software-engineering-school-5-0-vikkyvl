import { configPostgres } from './configs/config-postgres';
import { configGrpc } from './configs/config-grpc';
import { setupTestContainers, TestContainers } from './setup/setup-containers';
import { Response } from './helpers/response.dto';
import { DEFAULT_TEST_TIMEOUT } from './helpers/timeout';
import { configMail } from './mailhog/config-mail';
import {
  createApiGatewayApp,
  createSubscriptionServiceApp,
  createWeatherServiceApp,
} from './setup/setup-app';

export {
  configPostgres,
  configGrpc,
  configMail,
  setupTestContainers,
  TestContainers,
  Response,
  DEFAULT_TEST_TIMEOUT,
  createApiGatewayApp,
  createSubscriptionServiceApp,
  createWeatherServiceApp,
};
