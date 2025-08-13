const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_TEST_KEY);




module.exports = {stripe}