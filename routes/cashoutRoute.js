const express = require('express');
const verifyToken = require('../MiddleWires/verifyToken');

const router = express.Router()

router.post('/sendCashoutReq',verifyToken )

module.exports = router