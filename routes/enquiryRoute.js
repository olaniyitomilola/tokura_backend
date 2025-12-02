const express = require('express');
const { sendEnquiry } = require('../controllers/enquiryController');

const router = express.Router();
// POST /enquiry
router.post('/', sendEnquiry);
module.exports = router;