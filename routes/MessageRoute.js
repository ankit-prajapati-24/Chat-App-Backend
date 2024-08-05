const express = require('express');
const { getChats ,getRoomChat,uploadImage,getMyconnections} = require('../controllers/MessageController');
const route = express.Router();

route.get('/getchats',getChats);
route.post('/getRoomChat',getRoomChat); 
route.post('/uploadImage',uploadImage); 
route.post('/getMyconnections',getMyconnections); 
module.exports = route;

