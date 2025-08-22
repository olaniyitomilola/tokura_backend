module.exports = function orderShippedEmailTemplate({
  firstName,
  orderId,
  trackingNumber,
  trackingUrl,
  year = new Date().getFullYear()
}) {
  return `<!DOCTYPE html>
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

          <!-- Greeting with Burgundy Gradient -->
          <tr>
            <td style="padding:20px; background:linear-gradient(135deg,#b1687a,#91515e,#755157,#e49aa5); color:#ffffff;">
              <h2 style="margin:0; color:#ffffff;">Good news, ${firstName}!</h2>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:20px;">
              <p style="font-size:16px; line-height:1.5; margin:0 0 10px;">
                Your order <strong>#${orderId}</strong> has been shipped.
              </p>

              ${trackingNumber && trackingUrl ? `
                <p style="font-size:16px; line-height:1.5; margin:0 0 10px;">
                  You can track your shipment here:<br />
                  Tracking Number: <strong>${trackingNumber}</strong><br />
                  <a href="${trackingUrl}" target="_blank" style="color:#b1687a; text-decoration:none; font-weight:bold;">
                    Track your order
                  </a>
                </p>
              ` : ''}

              <p style="font-size:16px; line-height:1.5; margin:0;">
                Thank you for shopping with <strong>Tokura Luxury</strong>!
              </p>
            </td>
          </tr>

          <!-- Delivery Info -->
          <tr>
            <td style="padding:20px;">
              <h3 style="border-bottom:1px solid #ddd; padding-bottom:8px; margin:0 0 10px;">Delivery Information</h3>
              <p style="margin:0; font-size:16px; line-height:1.5;">
                ${shippingAddress.name}<br />
                ${shippingAddress.line1}<br />
                ${shippingAddress.line2 ? shippingAddress.line2 + '<br />' : ''}
                ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br />
                ${shippingAddress.country}<br />
                Phone: ${shippingAddress.phone}
              </p>
            </td>
          </tr>

          <!-- Contact Section with Background Image -->
          <tr>
            <td 
              background="https://michaelbaseet.com/uploads/1755875568922-0J3A2323-Edit.jpg"
              bgcolor="#000000"
              width="600"
              height="160"
              align="center"
              valign="middle"
              style="
                background-size:cover; 
                background-position:center; 
                text-align:center; 
                color:#ffffff;
              "
            >
              <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(128,0,32,0.15);">
                <tr>
                  <td align="center" valign="middle" style="padding:20px;">
                    <p style="margin:0; font-size:18px; font-weight:bold; color:#ffffff;">
                      If you have any questions about your order,
                    </p>
                    <p style="margin:8px 0 0; font-size:16px; color:#ffffff;">
                      Contact us at 
                      <a href="mailto:orders@tokuraluxury.com" 
                         style="color:#FFD700; text-decoration:none; font-weight:bold;">
                        orders@tokuraluxury.com
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
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
