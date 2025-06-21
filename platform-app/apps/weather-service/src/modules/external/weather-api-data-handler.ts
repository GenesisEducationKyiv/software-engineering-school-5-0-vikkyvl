import { WeatherGeneralResponseDto } from './dto';
import { RpcException } from '@nestjs/microservices';

export interface WeatherApiDataHandlerInterface {
  setNextHandler(
    handler: WeatherApiDataHandlerInterface,
  ): WeatherApiDataHandlerInterface;
  handleRequest(request: string): Promise<WeatherGeneralResponseDto>;
}

export abstract class AbstractWeatherApiDataHandler
  implements WeatherApiDataHandlerInterface
{
  protected nextHandler: WeatherApiDataHandlerInterface | null = null;
  provider: string;
  apiKey: string;
  url: string;

  protected constructor() {
    this.provider = '';
    this.apiKey = '';
    this.url = '';
  }

  setNextHandler(
    handler: WeatherApiDataHandlerInterface,
  ): WeatherApiDataHandlerInterface {
    this.nextHandler = handler;

    return handler;
  }

  async handleRequest(request: string): Promise<WeatherGeneralResponseDto> {
    if (this.nextHandler) {
      return this.nextHandler.handleRequest(request);
    }

    throw new RpcException(
      'All weather API handlers failed to process the request.',
    );
  }
}
