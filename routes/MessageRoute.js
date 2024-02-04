const express = require('express');
const { getChats } = require('../controllers/MessageController');
const route = express.Router();

route.get('/getchats',getChats);

module.exports = route;

