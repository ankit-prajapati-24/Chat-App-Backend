const express = require('express');
const { getChats ,getRoomChat} = require('../controllers/MessageController');
const route = express.Router();

route.get('/getchats',getChats);
route.post('/getRoomChat',getRoomChat);

module.exports = route;

