// services/paystack.js
const axios = require('axios');

const paystackConfig = {
    apiKey: process.env.PAYSTACK_API_KEY,
    baseUrl: 'https://api.paystack.co',
};

// Function to initiate payment with Paystack
const initiatePayment = async (email, amount) => {
    try {
        const response = await axios.post(`${paystackConfig.baseUrl}/transaction/initialize`, {
            email,
            amount,
        }, {
            headers: {
                Authorization: `Bearer ${paystackConfig.apiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to initiate payment with Paystack');
    }
};

// Function to verify Paystack transaction status
const verifyTransaction = async (reference) => {
    try {
        const response = await axios.get(`${paystackConfig.baseUrl}/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${paystackConfig.apiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to verify Paystack transaction');
    }
};

module.exports = {
    initiatePayment,
    verifyTransaction,
};
