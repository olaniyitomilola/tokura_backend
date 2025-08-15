function generateOrderId() {
  const timestamp = Date.now().toString().slice(-6); // last 6 digits of time
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random
  return `ORD-${timestamp}-${random}`;
}

module.exports = { generateOrderId };
