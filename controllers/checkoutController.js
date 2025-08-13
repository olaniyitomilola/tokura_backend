const { stripe } = require('../services/StripeService');

const createCheckoutSession = async (req, res) => {
  const { items, currency } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid input. Expected array of items.' });
  }

  try {
    const lineItems = items.map(item => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          description: item.size ? `Size: ${item.size}` : undefined, // optional
          metadata: {
            size: item.size || '',
            productId: item.id || ''
          }
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',

      return_url: `${process.env.PUBLIC_URL}/return?session_id={CHECKOUT_SESSION_ID}`,

      customer_creation: 'if_required',
      phone_number_collection: { enabled: true },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'FR', 'DE', 'IN', 'NG']
      }
    });

    res.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error);
    res.status(500).json({ error: 'Server error while creating checkout session' });
  }
};

module.exports = { createCheckoutSession };
