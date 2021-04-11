const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.js');
const userController = require('../controllers/userController.js');

router.get('/', authMiddleware.authenticateToken, userController.getUserFromJWT);

module.exports = router;