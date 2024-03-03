// services/flutterwave.js
const axios = require('axios');

const flutterwaveConfig = {
    apiKey: process.env.FLUTTERWAVE_API_KEY,
    baseUrl: 'https://api.flutterwave.com',
};

// Function to initiate payment with Flutterwave
const initiatePayment = async (email, amount) => {
    try {
        const response = await axios.post(`${flutterwaveConfig.baseUrl}/payments`, {
            email,
            amount,
            // Add more payment parameters as required by Flutterwave
        }, {
            headers: {
                Authorization: `Bearer ${flutterwaveConfig.apiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to initiate payment with Flutterwave');
    }
};

// Function to verify Flutterwave transaction status
const verifyTransaction = async (transactionId) => {
    try {
        const response = await axios.get(`${flutterwaveConfig.baseUrl}/transactions/${transactionId}/verify`, {
            headers: {
                Authorization: `Bearer ${flutterwaveConfig.apiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to verify Flutterwave transaction');
    }
};

module.exports = {
    initiatePayment,
    verifyTransaction,
};
