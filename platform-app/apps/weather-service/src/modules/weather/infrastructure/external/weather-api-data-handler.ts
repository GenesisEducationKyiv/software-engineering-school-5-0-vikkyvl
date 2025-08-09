import { WeatherGeneralResponseDto } from './dto';
import { weatherErrors } from '../../../../common';
import { AxiosError } from 'axios';
import { logProviderResponse } from './logger/provider-logger';
import { WeatherProvidersFailed } from '../../../../common';
import { CityNotFound } from '../../../../common';
import { DomainException } from '../../../../common';
import { Logger } from '@nestjs/common';

export interface WeatherApiDataHandlerInterface {
  setNextHandler(
    handler: WeatherApiDataHandlerInterface,
  ): WeatherApiDataHandlerInterface;
  handleRequest(request: string): Promise<WeatherGeneralResponseDto>;
}

export abstract class AbstractWeatherApiDataHandler
  implements WeatherApiDataHandlerInterface
{
  private readonly logger = new Logger(this.constructor.name);

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
      this.logger.warn(`Provider "${this.provider}" failed to handle request`);

      this.handleError(error);

      if (this.nextHandler) {
        return this.nextHandler.handleRequest(request);
      }

      throw new WeatherProvidersFailed();
    }
  }

  private handleError(error: unknown): void {
    if (error instanceof AxiosError) {
      logProviderResponse(this.provider, error.message);

      if (
        error.response?.status === weatherErrors.STATUS_404.status ||
        error.response?.status === weatherErrors.STATUS_400.status
      ) {
        throw new CityNotFound();
      }
    } else if (error instanceof DomainException) {
      logProviderResponse(this.provider, error.message);

      throw error;
    }
  }

  protected abstract fetchWeatherData(
    request: string,
  ): Promise<WeatherGeneralResponseDto>;
}
