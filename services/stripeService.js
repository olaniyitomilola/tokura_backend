// controllers/stripeController.js
const Stripe = require('stripe');
const { insertOrder } = require('../models/ordersModel');
const orderEmailTemplate = require('../templates/orderEmail');
const { sendMail } = require('./nodemailerService');
const { generateOrderId } = require('./orderIdService');



const stripe = new Stripe(process.env.STRIPE_TEST_KEY);

// Currency symbols map
const currencySymbols = {
    usd: '$',
    gbp: '£',
    cad: 'C$',
    ngn: '₦'
};

const stripePaid = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('❌ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const collected_info = session.collected_information || {};

        console.log('collected information: ', collected_info)

        try {
            // Generate unique orderId
            const orderId = generateOrderId();

            // Fetch line items
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { expand: ['data.price.product'] });

            console.log(lineItems.data)
            const items = lineItems.data.map(item => {
                const product = item.price.product; // expanded product

                console.log("Product: ", product.metadata)
                return {
                    name: product.name,
                    quantity: item.quantity,
                    price: (item.amount_total / 100).toFixed(2),
                    currency: session.currency,
                    size: product.metadata?.size || '',
                    image: product.metadata.image || '',
                    
                };
            });

            const customerEmail = session.customer_details?.email;
            const customerName = session.customer_details?.name || 'Valued Customer';
            const orderDate = new Date(session.created * 1000).toLocaleDateString();
            const totalAmount = (session.amount_total / 100).toFixed(2);

            const shippingAddress = {
                name: collected_info?.shipping_details?.name || '',
                line1: collected_info?.shipping_details?.address?.line1 || '',
                line2: collected_info?.shipping_details?.address?.line2 || '',
                city: collected_info?.shipping_details?.address?.city || '',
                state: collected_info?.shipping_details?.address?.state || '',
                postalCode: collected_info?.shipping_details?.address?.postal_code || '',
                country: collected_info?.shipping_details?.address?.country || '',
                phone: session.customer_details?.phone || '',
            };

            // Insert order into DB
            await insertOrder({
                orderId,
                stripeSessionId: session.id,
                stripePaymentIntentId: session.payment_intent,
                customerName,
                customerEmail,
                customerPhone: session.customer_details?.phone || null,
                billingAddress: session.customer_details?.address || null,
                shippingAddress: collected_info.shipping_details?.address || null,
                currency: session.currency,
                totalAmount: session.amount_total,
                status: 'paid',
                items
            });


            // Prepare and send email
            const symbol = currencySymbols[session.currency] || session.currency.toUpperCase();
            const html = orderEmailTemplate({
                customerName,
                orderId,
                orderDate,
                items,
                totalAmount,
                shippingAddress,
                year: new Date().getFullYear(),
                currency: session.currency.toUpperCase(),
            });

            await sendMail(
                customerEmail,
                `Your Order Confirmation - ${orderId}`,
                html,
                `Thank you for your order, ${customerName}!`, 'Tokura Luxury Order Confirmation!'
            );

            console.log(`✅ Confirmation email sent to ${customerEmail}`);
        } catch (err) {
            console.error('❌ Error handling completed payment:', err);
        }
    }

    res.status(200).json({ received: true });
};

module.exports = { stripe, stripePaid };
