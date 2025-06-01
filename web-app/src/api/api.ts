import api from './index'

export const getWeatherByCity = async (city: string) => {
    const res = await api.get(`/api/weather?city=${city}`);
    return res.data;
};

export const subscibeWeather = async(data:{
    email: string,
    city: string,
    frequency: 'daily' | 'hourly';
})=> {
    const res = await api.post('/api/subscribe', data);
    return res.data;
};

export const confirmSubscription = async (token: string) => {
    const res = await api.get(`/api/confirm/${token}`);
    return res.data;
};

export const unsubscribeWeather = async (token: string) => {
    const res = await api.get(`/api/unsubscribe/${token}`);
    return res.data;
};