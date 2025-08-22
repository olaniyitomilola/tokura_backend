module.exports = function orderShippedEmailTemplate({
  firstName,
  orderId,
  trackingNumber,
  trackingUrl,
  year = new Date().getFullYear()
}) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Your Order Has Shipped</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f6f6f6; font-family:Arial, sans-serif; color:#333;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f6f6f6; padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
            
            <!-- Header with Logo -->
            <tr>
              <td style="background-color:#fff; padding:20px; text-align:center;">
                <img src="https://michaelbaseet.com/uploads/1755872893851-tokura.jpg" 
                     alt="Tokura Luxury" 
                     style="max-width:200px; height:auto;" />
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding:20px;">
                <h2 style="margin-top:0;">Hi ${firstName},</h2>
                <p style="font-size:16px; line-height:1.5;">
                  Good news! Your order <strong>#${orderId}</strong> has been shipped.
                </p>

                ${trackingNumber && trackingUrl ? `
                  <p style="font-size:16px; line-height:1.5;">
                    You can track your shipment using the details below:<br />
                    Tracking Number: <strong>${trackingNumber}</strong><br />
                    <a href="${trackingUrl}" target="_blank">Track your order</a>
                  </p>
                ` : ''}

                <p style="font-size:16px; line-height:1.5;">
                  Thank you for shopping with <strong>Tokura Luxury</strong>!
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
