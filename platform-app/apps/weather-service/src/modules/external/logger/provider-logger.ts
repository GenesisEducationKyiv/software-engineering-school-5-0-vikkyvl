import * as fs from 'fs';
import * as path from 'path';

const LOG_FILE_PATH = path.resolve(
  __dirname,
  '../../external/logger/logs/weather-providers.log',
);

export function logProviderResponse(provider: string, response: unknown) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    provider: provider,
    response: response,
  };
  try {
    if (!fs.existsSync(LOG_FILE_PATH)) {
      fs.mkdirSync(path.dirname(LOG_FILE_PATH), { recursive: true });
    }

    fs.appendFileSync(LOG_FILE_PATH, JSON.stringify(logEntry) + '\n', {
      encoding: 'utf8',
    });
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : String(error));
  }
}
