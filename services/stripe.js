// services/stripe.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Function to initiate payment with Stripe
const initiatePayment = async (email, amount, cardToken) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
            receipt_email: email,
            payment_method: cardToken, // Token representing the card
        });
        return paymentIntent;
    } catch (error) {
        throw new Error('Failed to initiate payment with Stripe');
    }
};

// Function to verify Stripe transaction status
const verifyTransaction = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent;
    } catch (error) {
        throw new Error('Failed to verify Stripe transaction');
    }
};

module.exports = {
    initiatePayment,
    verifyTransaction,
};
