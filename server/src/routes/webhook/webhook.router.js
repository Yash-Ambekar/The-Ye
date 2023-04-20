const express = require('express');

const {
    hookMessage, verifyToken,
} = require('./webhook.controller');

const webHookRouter = express.Router();

webHookRouter.get('/', verifyToken);
webHookRouter.post('/', hookMessage);

module.exports = webHookRouter;