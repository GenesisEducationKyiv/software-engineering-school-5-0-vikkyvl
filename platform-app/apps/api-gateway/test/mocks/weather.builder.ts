import { WeatherGeneralResponseDto } from '../../../weather-service/src/modules/weather/infrastructure/external/dto';

export class WeatherBuilder {
  private static readonly TEST_TEMP_C: number = 18.7;
  private static readonly TEST_HUMIDITY: number = 73;
  private static readonly TEST_CONDITION: string = 'Clear';
  private static readonly TEST_CITY: string = 'kyiv';
  private static readonly TEST_INVALID_CITY: string = 'kyviv';
  private static readonly TEST_INVALID_CITY_WITH_NUMBER: string = 'Ky4viv';
  private static readonly TEST_DELAY_CITY: string = 'delaycity';

  public static getCity(): string {
    return this.TEST_CITY;
  }

  public static getInvalidCity(): string {
    return this.TEST_INVALID_CITY;
  }

  public static getInvalidCityWithNumber(): string {
    return this.TEST_INVALID_CITY_WITH_NUMBER;
  }

  public static getDelayCity(): string {
    return this.TEST_DELAY_CITY;
  }

  public static weatherGeneralResponse(): WeatherGeneralResponseDto {
    return {
      temperature: this.TEST_TEMP_C,
      humidity: this.TEST_HUMIDITY,
      description: this.TEST_CONDITION,
    };
  }
}
