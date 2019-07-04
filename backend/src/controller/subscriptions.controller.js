const express = require('express');
const app = express();
const subscriptionsService = require('../service/subscriptions.service');
const authMiddleware = require('../middleware/auth.middleware');

const log = (text, params) => {
  console.log(`[subscription.controller] -> ${text}`, params);
};

const remove = async (req, res) => {
  console.group(`[subscriptions.controller] [delete]`);
  try {
    const {goodId} = req.body;
    if (!goodId) {
      throw new Error(`id required`);
    }
    const {vk} = req.user;
    if (!vk) {
      throw new Error(`userVk required`);
    }
  
    const subscription = await subscriptionsService.remove({goodId, userVk: vk});
    log(`[remove] done`, subscription);
    console.groupEnd();
    res.json(subscription);
  } catch (e) {
    console.groupEnd();
    res.status(500).json({error: e.message});
  }
};

const search = async (req, res) => {
  console.group(`[subscriptions.controller] [search]`);
  try {
    const {id} = req.query;
    if (!id) {
      throw new Error(`id required`);
    }

    const subscription = (await subscriptionsService.search({id}))[0] || {};
    log(`[search] done`, subscription);
    console.groupEnd();
    res.json(subscription);
  } catch (e) {
    console.groupEnd();
    res.status(500).json({error: e.message});
  }
};

const save = async (req, res) => {
  console.group(`[subscriptions.controller] [save]`);
  try {
    const {id, price_discount, percent_discount} = req.body;
    if (!id) {
      throw new Error(`id required`);
    }

    const subscription = await subscriptionsService.save({id, price_discount, percent_discount});
    log(`[save] done`, subscription);
    console.groupEnd();
    res.json(subscription);
  } catch (e) {
    console.groupEnd();
    res.status(500).json({error: e.message});
  }
};

app.delete('/', authMiddleware.authRequired, remove);
app.get('/', authMiddleware.authRequired, search);
app.post('/', authMiddleware.authRequired, save);

module.exports = app;