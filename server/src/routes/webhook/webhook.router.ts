import express from 'express'

import controller from "./webhook.controller"

const webHookRouter = express.Router();

webHookRouter.get('/', controller.verifyToken);
webHookRouter.post('/', controller.hookMessage);

export default webHookRouter;