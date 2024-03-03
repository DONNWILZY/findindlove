// services/paypal.js
const paypal = require('@paypal/checkout-server-sdk');

// Configure PayPal SDK
const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);

// Function to initiate payment with PayPal
const initiatePayment = async (email, amount) => {
    try {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: amount,
                },
            }],
            application_context: {
                brand_name: 'Your Brand Name',
                landing_page: 'BILLING',
                user_action: 'CONTINUE',
            },
        });
        const response = await client.execute(request);
        return response.result;
    } catch (error) {
        throw new Error('Failed to initiate payment with PayPal');
    }
};

// Function to capture PayPal payment
const capturePayment = async (orderId) => {
    try {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        const response = await client.execute(request);
        return response.result;
    } catch (error) {
        throw new Error('Failed to capture PayPal payment');
    }
};

module.exports = {
    initiatePayment,
    capturePayment,
};
