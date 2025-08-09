export interface BrokerConfigInterface {
  getBrokerUrl(): string;
  getPort(): number | string;
  getQueueName(): string;
}
