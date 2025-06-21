import { Weather } from '../../src/entities/weather.entity';
import { WeatherDto } from '../../../../common/shared';
import { WeatherGeneralResponseDto } from '../../src/modules/external/dto';

export class WeatherServiceBuilder {
  private static readonly TEST_TEMP_C: number = 18.7;
  private static readonly TEST_HUMIDITY: number = 73;
  private static readonly TEST_CONDITION: string = 'Clear';
  private static readonly TEST_CITY: string = 'Kyiv';
  private static readonly TEST_INVALID_CITY: string = 'Kyviv';
  private static readonly TEST_ID: number = 1;
  private static readonly TEST_CREATED_AT: Date = new Date(
    '2024-01-01T00:00:00Z',
  );
  private static readonly TEST_UPDATE_AT: Date = new Date(
    '2024-01-01T00:00:00Z',
  );

  public static weatherGeneralResponse(): WeatherGeneralResponseDto {
    return {
      temperature: this.TEST_TEMP_C,
      humidity: this.TEST_HUMIDITY,
      description: this.TEST_CONDITION,
    };
  }

  public static getCity(): string {
    return this.TEST_CITY;
  }

  public static getInvalidCity(): string {
    return this.TEST_INVALID_CITY;
  }

  public static weatherEntity(): Weather {
    return {
      id: this.TEST_ID,
      city: this.TEST_CITY,
      temperature: this.TEST_TEMP_C,
      humidity: this.TEST_HUMIDITY,
      description: this.TEST_CONDITION,
      createdAt: this.TEST_CREATED_AT,
      updatedAt: this.TEST_UPDATE_AT,
    };
  }

  public static totalResult(): WeatherDto {
    return {
      temperature: this.TEST_TEMP_C,
      humidity: this.TEST_HUMIDITY,
      description: this.TEST_CONDITION,
    };
  }

  public static dataToSave(): Partial<Weather> {
    return {
      city: this.TEST_CITY,
      temperature: this.TEST_TEMP_C,
      humidity: this.TEST_HUMIDITY,
      description: this.TEST_CONDITION,
    };
  }
}
