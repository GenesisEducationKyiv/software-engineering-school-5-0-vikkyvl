import React, { useState } from 'react';
import { getWeatherByCity, subscibeWeather } from '../api/api';
import '../styles/SubscriptionForm.css';

const SubscriptionForm = () => {
    const[email, setEmail] = useState('');
    const[city, setCity] = useState('');
    const[frequency, setFrequency] = useState<'daily' | 'hourly'>('daily');
    const[message, setMessage] = useState('');
    const[loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await getWeatherByCity(city);

            const subscriptionResult = await subscibeWeather({email, city, frequency});
            setMessage(subscriptionResult.status || 'Confirmation email sent.');
        } catch (err: any) {
            const status = err?.response?.status;
            const message = err?.response?.data?.message || err.message;

            if (status === 409) {
                setMessage('Email already subscribed.');
            } else if (status === 404) {
                setMessage('City not found');
            } else {
                setMessage(message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Subscribe to your city's weather</h2>

            <label>Email:</label>
            <input
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
            />

            <label>City:</label>
            <input
                type="text"
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}
            />

            <label>Frequency:</label>
            <select
                value={frequency}
                required
                onChange={(e) => setFrequency(e.target.value as 'daily' | 'hourly')}
            >
                <option value="" disabled>Select frequency</option> {}
                <option value="daily">Daily</option>
                <option value="hourly">Hourly</option>
            </select>

            <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Subscribe'}
            </button>

            {message && <p>{message}</p>}
        </form>
    );
};

export default SubscriptionForm;

