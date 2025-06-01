import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { confirmSubscription } from '../api/api';

const ConfirmPage = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('Confirming your subscription...');

    useEffect(() => {
        const confirm = async () => {
            try {
                const data = await confirmSubscription(token!);
                setMessage(data.message || 'Subscription confirmed.');
            } catch (err: any) {
                // const errorMessage =
                //     err?.response?.data?.message ||
                //     err?.message ||
                //     'Invalid or expired token.';
                // setMessage(errorMessage);
            }
        };
        confirm();
    }, [token]);

    return (
        <h2 style={{ textAlign: 'center', marginTop: '100px' }}>{message}</h2>
    );
};

export default ConfirmPage;
