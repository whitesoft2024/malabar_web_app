// gdcsSchemeRoutes.js
const express = require('express');
const router = express.Router();
const gdcsCreateController = require('../controllers/gdcsCreateController');

router.get('/api/gdcsCreateFetch', gdcsCreateController.fetch);

module.exports = router;
