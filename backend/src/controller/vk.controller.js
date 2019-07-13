const express = require('express');
const app = express();
const subscriptionsService = require('../service/subscriptions.service');
const authMiddleware = require('../middleware/auth.middleware');

const log = (text, params) => {
  console.log(`[vk.controller] -> ${text}`, params);
};

const callbackApi = async (req, res) => {
  console.group(`[vk.controller] [callbackApi]`);
  try {
    const {id, price_discount, percent_discount, autobuy_price} = req.body;
    log(req.body);
    res.json('242a39f8');
  } catch (e) {
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
  }
};

app.post('/', callbackApi);

module.exports = app;