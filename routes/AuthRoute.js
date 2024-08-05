const express = require('express');
const route = express.Router();
const { SendOtp, Login,Signup } = require('../controllers/Auth');

route.post('/SendOtp',SendOtp);
route.post('/Login',Login);
route.post('/Signup',Signup);

module.exports = route;
