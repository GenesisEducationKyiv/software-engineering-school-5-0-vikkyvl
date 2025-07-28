import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from '../src/modules/weather/weather.service';
import { WeatherRepositoryInterface } from '../src/modules/weather/infrastructure/repository/interfaces/weather.repository.interface';
import { WeatherApiClientServiceInterface } from '../src/modules/weather/infrastructure/external/weather-api-client.service';
import { WeatherServiceBuilder } from './mocks/weather.service.builder';
import { weatherErrors, weatherTokens } from '../src/common';
import { RpcException } from '@nestjs/microservices';

describe('Weather Service (unit)', () => {
  let service: WeatherService;
  let mockRepository: jest.Mocked<WeatherRepositoryInterface>;
  let mockWeatherApiClient: jest.Mocked<WeatherApiClientServiceInterface>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: weatherTokens.WEATHER_REPOSITORY_INTERFACE,
          useValue: {
            createWeather: jest.fn(),
            saveWeather: jest.fn(),
          },
        },
        {
          provide: weatherTokens.WEATHER_SERVICE_PROXY,
          useValue: {
            fetchWeather: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    mockRepository = module.get(weatherTokens.WEATHER_REPOSITORY_INTERFACE);
    mockWeatherApiClient = module.get(weatherTokens.WEATHER_SERVICE_PROXY);
  });

  describe('getWeatherFromAPI()', () => {
    let city: ReturnType<typeof WeatherServiceBuilder.getCity>;
    let invalidCity: ReturnType<typeof WeatherServiceBuilder.getInvalidCity>;
    let weatherData: ReturnType<
      typeof WeatherServiceBuilder.weatherGeneralResponse
    >;
    let weatherEntity: ReturnType<typeof WeatherServiceBuilder.weatherEntity>;
    let totalResult: ReturnType<typeof WeatherServiceBuilder.totalResult>;
    let dataToSave: ReturnType<typeof WeatherServiceBuilder.dataToSave>;

    beforeEach(() => {
      city = WeatherServiceBuilder.getCity();
      invalidCity = WeatherServiceBuilder.getInvalidCity();
      weatherData = WeatherServiceBuilder.weatherGeneralResponse();
      weatherEntity = WeatherServiceBuilder.weatherEntity();
      totalResult = WeatherServiceBuilder.totalResult();
      dataToSave = WeatherServiceBuilder.dataToSave();

      mockWeatherApiClient.fetchWeather.mockImplementation((city: string) => {
        if (city === invalidCity) {
          return Promise.reject(new RpcException(weatherErrors.CITY_NOT_FOUND));
        }

        return Promise.resolve({
          response: weatherData,
          isRecordInCache: false,
        });
      });

      mockRepository.createWeather.mockReturnValue(weatherEntity);
      mockRepository.saveWeather.mockResolvedValue(weatherEntity);
    });

    it('should return current weather for a given city', async () => {
      const response = await mockWeatherApiClient.fetchWeather(city);

      expect(mockWeatherApiClient.fetchWeather).toHaveBeenCalledWith(city);
      expect(response.response).toEqual(weatherData);
    });

    it('should call createWeather with correct data', async () => {
      await service.getWeatherFromAPI(city);

      expect(mockRepository.createWeather).toHaveBeenCalledWith(dataToSave);
    });

    it('should call saveWeather with correct data', async () => {
      await service.getWeatherFromAPI(city);

      expect(mockRepository.saveWeather).toHaveBeenCalledWith(weatherEntity);
    });

    it('should return correct DTO', async () => {
      const result = await service.getWeatherFromAPI(city);

      expect(result).toEqual(totalResult);
    });

    it('should throw RpcException if city not found', async () => {
      await expect(
        mockWeatherApiClient.fetchWeather(invalidCity),
      ).rejects.toThrow(RpcException);
      expect(mockWeatherApiClient.fetchWeather).toHaveBeenCalledWith(
        invalidCity,
      );
    });

    it('should throw RpcException if city not found and not call save/create', async () => {
      await expect(service.getWeatherFromAPI(invalidCity)).rejects.toThrow(
        RpcException,
      );

      expect(mockRepository.createWeather).not.toHaveBeenCalled();
      expect(mockRepository.saveWeather).not.toHaveBeenCalled();
    });
  });
});
