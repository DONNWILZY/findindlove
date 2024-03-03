const axios = require('axios');

const convertToNGN = async (amount, currency) => {
    try {
        let amountInNGN;
        if (currency !== 'NGN') {
            // Fetch the latest exchange rates
            const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');

            if (response.status === 200) {
                // Extract the exchange rate for USD to NGN
                const usdToNgnRate = response.data.rates['NGN'];

                // Convert the amount to NGN
                amountInNGN = amount * usdToNgnRate;
            } else {
                throw new Error('Failed to fetch exchange rates');
            }
        } else {
            // If currency is already NGN, no conversion needed
            amountInNGN = amount;
        }

        return amountInNGN;
    } catch (error) {
        console.error('Error converting amount to NGN:', error.message);
        throw error;
    }
};

module.exports = convertToNGN;
