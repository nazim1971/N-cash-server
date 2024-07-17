const express = require('express');

const router = express.Router()

const {loger, login, logoutUser, addUser, getAllUser, getAllAgent, updateSender, pinVerification, getAllUandA, updateAccount} = require('../controller/userController');
const verifyToken = require('../MiddleWires/verifyToken');
const verifyAdmin = require('../MiddleWires/verifyAdmin');

// user create login and logout route
router.post('/login', login);
router.post('/addUser', addUser);
router.post('/logout', logoutUser);

router.get('/loger', verifyToken, loger );
router.get('/allUserForSend', verifyToken, getAllUser);
router.get('/allAgent', verifyToken,getAllAgent);

router.patch('/updateSender', verifyToken, updateSender)

router.post('/checkPin', verifyToken , pinVerification)

//*************** All Admin related Routes */
// get all user and agent
router.get('/allUandA',verifyToken , verifyAdmin , getAllUandA)
router.patch('/updateAccount', verifyToken , verifyAdmin , updateAccount)

module.exports = router