export const patternsRMQ = {
  SUBSCRIPTION: {
    CREATE_SUBSCRIPTION: { cmd: 'create_subscription' },
    CREATED_SUBSCRIPTION: { event: 'subscription_created' },
  },
  CONFIRMATION: {
    GET_TOKEN: { cmd: 'confirm_subscription' },
  },
  UNSUBSCRIPTION: {
    GET_TOKEN: { cmd: 'unsubscribe_subscription' },
  },
};

export const patternsGRPC = {
  WEATHER: {
    SERVICE: 'WeatherService',
    METHOD: 'GetWeather',
  },
};
