const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const {stripePaid} = require("../services/stripeService");

router.post('/', bodyParser.raw({type: 'application/json'}) , stripePaid);

module.exports = router;
