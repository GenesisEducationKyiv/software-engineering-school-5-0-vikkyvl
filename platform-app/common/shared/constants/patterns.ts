export const patterns = {
  WEATHER: {
    GET_WEATHER: { cmd: 'get_weather' },
  },
  SUBSCRIPTION: {
    CREATE_SUBSCRIPTION: { cmd: 'create_subscription' },
  },
  CONFIRMATION: {
    GET_TOKEN: { cmd: 'confirm_subscription' },
  },
  UNSUBSCRIPTION: {
    GET_TOKEN: { cmd: 'unsubscribe_subscription' },
  },
};
