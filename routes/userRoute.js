const express = require('express');

const router = express.Router()

const {loger, login, logoutUser, addUser, getAllUser, getAllAgent, updateSender, pinVerification} = require('../controller/userController');
const verifyToken = require('../MiddleWires/verifyToken');

// user create login and logout route
router.post('/login', login);
router.post('/addUser', addUser);
router.post('/logout', logoutUser);

router.get('/loger', loger );
router.get('/allUserForSend', verifyToken, getAllUser);
router.get('/allAgent', getAllAgent);

router.patch('/updateSender', updateSender)

router.post('/checkPin', pinVerification)

module.exports = router