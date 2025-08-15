require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require("./routes/uploadRoutes");
const productLengthRoutes = require('./routes/productLengthRoutes');
const vistorRoutes = require('./routes/visitorRoutes');
const checkoutRoutes = require('./routes/checkoutRoute');
const { sendMail } = require('./services/nodemailerService');
const orderEmail = require('./templates/orderEmail');
const sampleOrder = {
  customerName: "Pelumi Olaniyi",
  customerEmail: "oviareflex3112@gmail.com",
  orderId: "ORD123456",
  orderDate: "2025-08-15",
  items: [
    { name: "Noir Tokura 22'", quantity: 1, price: 700 },
    { name: "Tokura Luxe Boho Braids 18'", quantity: 3, price: 520 },
  ],
  totalAmount: 1120,
  shippingAddress: {
    name: "Pelumi Olaniyi",
    street: "242 Davisviille",
    city: "Toronto",
    state: "Ontario",
    postalCode: "MS1 912",
    country: "Canada",
    phone: "+2348012345678"
  }
  , currency: "CAD"
};


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*', // allow all origins
}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/images", uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products', productLengthRoutes);
app.use('/api/vis', vistorRoutes )
app.use('/api/checkout', checkoutRoutes);


app.get('/', (req, res) => res.send('Store API is running'));
app.listen(PORT, async () => {
//  try {
//    await sendMail(sampleOrder.customerEmail,'Order Received', orderEmail(sampleOrder), 'Your order has been received successfully.');
//   }
//    catch (error) {
//    console.error("❌ Error sending email:", error);
//  }
  console.log(`Server running on http://localhost:${PORT}`);
});
