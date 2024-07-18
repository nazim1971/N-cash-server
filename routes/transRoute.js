const express = require('express');
const { sendTrans, allTransHis } = require('../controller/transController');
const verifyToken = require('../MiddleWires/verifyToken');
const verifyAdmin = require('../MiddleWires/verifyAdmin');

const router = express.Router()

router.post('/sendTrans',verifyToken ,sendTrans)
router.get('/allTransHistory', verifyToken, verifyAdmin , allTransHis)

module.exports = router