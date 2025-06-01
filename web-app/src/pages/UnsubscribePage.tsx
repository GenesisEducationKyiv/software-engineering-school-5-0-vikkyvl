import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { unsubscribeWeather } from '../api/api';

const UnsubscribePage = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('Processing unsubscribe...');

    useEffect(() => {
        const unsubscribe = async () => {
            try {

                const data = await unsubscribeWeather(token!);
                setMessage(data.message || 'Unsubscribed successfully.');
            } catch (err: any) {
                // const errorMessage =
                //     err?.response?.data?.message ||
                //     err?.message ||
                //     'Invalid or expired token.';
                // setMessage(errorMessage);
            }
        };
        unsubscribe();
    }, [token]);

    return (
        <h2 style={{ textAlign: 'center', marginTop: '100px' }}>{message}</h2>
    );
};

export default UnsubscribePage;


