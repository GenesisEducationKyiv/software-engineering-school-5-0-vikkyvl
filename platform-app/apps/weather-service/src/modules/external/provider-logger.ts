import * as fs from 'fs';
import * as path from 'path';

const LOG_FILE_PATH = path.resolve(
  __dirname,
  '../../../src/modules/external/logs/weather-providers.log',
);

export function logProviderResponse(provider: string, response: any) {
  const logEntry = `${new Date().toISOString()} - ${provider} - Response: ${JSON.stringify(response)}\n`;
  fs.mkdirSync(path.dirname(LOG_FILE_PATH), { recursive: true });
  fs.appendFileSync(LOG_FILE_PATH, logEntry, { encoding: 'utf8' });
}
