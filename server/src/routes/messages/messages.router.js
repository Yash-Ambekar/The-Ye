
const express = require('express');

const {
    responseMessage,
} = require('./messages.controller');

const messageRouter = express.Router();

messageRouter.post('/', responseMessage)

module.exports = messageRouter;