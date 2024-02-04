const express = require('express');
const { UpdateProfile,getAllUsers} = require('../controllers/ProfileController');
const route = express.Router();

route.post("/UpdateProfile", UpdateProfile);
route.get("/getAllUsers", getAllUsers);

module.exports = route;