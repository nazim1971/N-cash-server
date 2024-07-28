const express = require('express');
const { sendTrans, allTransHis, singleUserReq, userAllTrans, updateStatus } = require('../controller/transController');
const verifyToken = require('../MiddleWires/verifyToken');
const verifyAdmin = require('../MiddleWires/verifyAdmin');

const router = express.Router()

router.post('/sendTrans',verifyToken ,sendTrans)
router.get('/getSingleUserReq', verifyToken, singleUserReq)
router.get('/allTransHistory', verifyToken, verifyAdmin , allTransHis)
router.get('/userAllTrans', verifyToken, userAllTrans)

router.patch('/updateStatus', verifyToken, updateStatus)

module.exports = router