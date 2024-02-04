const express = require('express');
const route = express.Router();
const { SendOtp, Login } = require('../controllers/Auth');

route.post('/SendOtp',SendOtp);
route.post('/Login',Login);

module.exports = route;
