require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require("./routes/uploadRoutes");
const productLengthRoutes = require('./routes/productLengthRoutes');
const vistorRoutes = require('./routes/visitorRoutes');
const checkoutRoutes = require('./routes/checkoutRoute');


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
  console.log(`Server running on http://localhost:${PORT}`);
});
