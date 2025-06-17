import { WeatherDto } from '../../../../common/shared/dtos/weather/weather.dto';

export class WeatherBuilder {
  private static readonly TEST_TEMP_C: number = 18.7;
  private static readonly TEST_HUMIDITY: number = 73;
  private static readonly TEST_CONDITION: string = 'Clear';
  private static readonly TEST_CITY: string = 'Kyiv';
  private static readonly TEST_INVALID_CITY: string = 'Kyviv';

  public static getCity(): string {
    return this.TEST_CITY;
  }

  public static getInvalidCity(): string {
    return this.TEST_INVALID_CITY;
  }

  public static totalResult(): WeatherDto {
    return {
      temperature: this.TEST_TEMP_C,
      humidity: this.TEST_HUMIDITY,
      description: this.TEST_CONDITION,
    };
  }
}
