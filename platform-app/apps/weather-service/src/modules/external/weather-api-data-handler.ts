import { WeatherGeneralResponseDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import { weatherErrors } from '../../common';
import { AxiosError } from 'axios';
import { logProviderResponse } from './logger/provider-logger';

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
  protected abstract provider: string;

  setNextHandler(
    handler: WeatherApiDataHandlerInterface,
  ): WeatherApiDataHandlerInterface {
    this.nextHandler = handler;

    return handler;
  }

  async handleRequest(request: string): Promise<WeatherGeneralResponseDto> {
    try {
      const response: WeatherGeneralResponseDto =
        await this.fetchWeatherData(request);

      logProviderResponse(this.provider, response);

      return response;
    } catch (error) {
      this.handleError(error);

      if (this.nextHandler) {
        return this.nextHandler.handleRequest(request);
      }

      throw new RpcException(
        'All weather API handlers failed to process the request.',
      );
    }
  }

  private handleError(error: unknown): void {
    if (error instanceof AxiosError) {
      logProviderResponse(this.provider, error.message);

      if (
        error.response?.status === weatherErrors.STATUS_404.status ||
        error.response?.status === weatherErrors.STATUS_400.status
      ) {
        throw new RpcException(weatherErrors.CITY_NOT_FOUND);
      }
    } else if (error instanceof RpcException) {
      logProviderResponse(this.provider, error.message);

      throw error;
    }
  }

  protected abstract fetchWeatherData(
    request: string,
  ): Promise<WeatherGeneralResponseDto>;
}
