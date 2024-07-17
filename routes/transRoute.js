const express = require('express');
const { sendTrans } = require('../controller/transController');
const verifyToken = require('../MiddleWires/verifyToken');

const router = express.Router()

router.post('/sendTrans',verifyToken ,sendTrans)

module.exports = router