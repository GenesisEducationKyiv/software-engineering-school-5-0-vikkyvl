class ObservabilityConfigService {
  constructor() {}

  public getLokiUrl() {
    return process.env.LOKI_URL ?? 'http://localhost:3100';
  }

  public getLogWorkHourStart() {
    return Number(process.env.LOG_WORK_HOUR_START);
  }

  public getLogWorkHourEnd() {
    return Number(process.env.LOG_WORK_HOUR_END);
  }

  public getLogSampleRateWork() {
    return Number(process.env.LOG_SAMPLE_RATE_WORK);
  }

  public getLogSampleRateNonWork() {
    return Number(process.env.LOG_SAMPLE_RATE_NON_WORK);
  }

  public getLogToConsole() {
    return Boolean(process.env.LOG_TO_CONSOLE);
  }
}

const observabilityConfigService = new ObservabilityConfigService();

export { observabilityConfigService };
