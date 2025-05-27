const express = require('express');
const router = express.Router();
const consultationController = require('../controller/consultationController');

// Tạo cuộc tư vấn (booking consultation)
router.post('/create-consultation', consultationController.createConsultation);
router.get('/getConsultation',consultationController.getConsultations)
module.exports = router;
