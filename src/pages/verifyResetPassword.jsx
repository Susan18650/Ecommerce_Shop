import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const VerifyResetTokenPassword = () => {
    const navigate = useNavigate();

    const { id, token } = useParams();

    const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(`${gBASE_URL}/auth/reset-password/${id}/${token}`);
                if (response.ok) {
                    navigate(`/reset-password/${id}/${token}`);
                } else {
                    navigate('/token-error');
                }
            } catch (error) {
                console.error(error);
                navigate('/token-error');
            }
        };

        verifyToken();
        const intervalId = setInterval(verifyToken, 5 * 60 * 1000); // verify every 5 minutes

        return () => clearInterval(intervalId)
    }, [id, token, navigate]);

    return <div>Loading...</div>;
};
