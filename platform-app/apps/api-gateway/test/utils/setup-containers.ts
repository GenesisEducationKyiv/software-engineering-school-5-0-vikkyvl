import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { configPostgres } from './config-postgres';

export interface TestContainers {
  rabbit: {
    container: StartedTestContainer;
    url: string;
  };
  postgres: {
    container: StartedTestContainer;
    host: string;
    port: number;
  };
}

export async function setupTestContainers(): Promise<TestContainers> {
  const rabbitContainer = await new GenericContainer('rabbitmq:3.11-alpine')
    .withExposedPorts(5672)
    .start();

  const rabbitUrl = `amqp://${rabbitContainer.getHost()}:${rabbitContainer.getMappedPort(5672)}`;

  const postgresContainer = await new GenericContainer('postgres:15-alpine')
    .withExposedPorts(5432)
    .withEnvironment({
      POSTGRES_DB: configPostgres.TEST_DB,
      POSTGRES_USER: configPostgres.TEST_USER,
      POSTGRES_PASSWORD: configPostgres.TEST_PASSWORD,
    })
    .start();

  return {
    rabbit: {
      container: rabbitContainer,
      url: rabbitUrl,
    },
    postgres: {
      container: postgresContainer,
      host: postgresContainer.getHost(),
      port: postgresContainer.getMappedPort(5432),
    },
  };
}
