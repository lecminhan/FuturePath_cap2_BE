const express = require('express');
const router = express.Router();

const dataController = require('../controller/getUserDataByRoleController');

// Route nhận param role và id
router.get('/:role/:id', dataController.getDataByRoleAndId);

module.exports = router;
