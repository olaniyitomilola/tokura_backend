// templates/orderEmail.js

module.exports = function orderEmailTemplate({
  customerName,
  orderId,
  orderDate,
  items,
  totalAmount,
  shippingAddress,
  currency = 'USD', // default
  year = new Date().getFullYear(),
}) {
  // Map currency codes to symbols
  const currencySymbols = {
    USD: '$',
    GBP: '£',
    CAD: 'C$',
    NGN: '₦',
  };
  const symbol = currencySymbols[currency.toUpperCase()] || currency;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #eee;">
        <strong>${item.name}</strong>  
        ${item.size ? `(Size: ${item.size})` : ''}  
        × ${item.quantity}
      </td>
      <td style="padding:8px 0; text-align:right; border-bottom:1px solid #eee;">
        ${symbol}${item.price}
      </td>
    </tr>
  `).join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Order Confirmation</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f6f6f6; font-family:Arial, sans-serif; color:#333;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f6f6f6; padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background-color:#000000; padding:20px; text-align:center;">
                <h1 style="margin:0; color:#ffffff; font-size:24px;">Tokura Luxury</h1>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding:20px;">
                <h2 style="margin-top:0;">Thank you for your order, ${customerName}!</h2>
                <p style="font-size:16px; line-height:1.5;">
                  We’ve received your order <strong>#${orderId}</strong> placed on ${orderDate}.
                  You’ll receive another email when it ships.
                </p>
                <p style="font-size:16px; line-height:1.5;">
                  You can track your order status using your email and order number at 
                  <a href="https://www.tokuraluxury.com/order" target="_blank">www.tokuraluxury.com/order</a>.
                </p>
              </td>
            </tr>

            <!-- Order Summary -->
            <tr>
              <td style="padding:0 20px 20px;">
                <h3 style="border-bottom:1px solid #ddd; padding-bottom:8px;">Order Summary</h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  ${itemsHtml}
                  <tr>
                    <td style="padding:8px 0; font-weight:bold;">Total</td>
                    <td style="padding:8px 0; text-align:right; font-weight:bold;">
                      ${symbol}${totalAmount}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Delivery Info -->
            <tr>
              <td style="padding:20px;">
                <h3 style="border-bottom:1px solid #ddd; padding-bottom:8px;">Delivery Information</h3>
                <p style="margin:0; font-size:16px; line-height:1.5;">
                  ${shippingAddress.name}<br />
                  ${shippingAddress.street}<br />
                  ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br />
                  ${shippingAddress.country}<br />
                  Phone: ${shippingAddress.phone}
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#000000; padding:15px; text-align:center; color:#ffffff; font-size:14px;">
                © ${year} Tokura Luxury. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
