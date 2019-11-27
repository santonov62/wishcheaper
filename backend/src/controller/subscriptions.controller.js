const express = require('express');
const app = express();
const subscriptionsService = require('../service/subscriptions.service');
const authMiddleware = require('../middleware/auth.middleware');

const log = (text, params) => {
  console.log(`[subscription.controller] -> ${text}`, params);
};

const remove = async (req, res) => {
  console.group(`[subscriptions.controller] [remove]`);
  try {
    const {goodId} = req.body;
    if (!goodId) {
      throw new Error(`id required`);
    }
    const {vk} = req.user;
    if (!vk) {
      throw new Error(`userVk required`);
    }
  
    const subscription = await subscriptionsService.removeWithProduct({goodId, userVk: vk});
    log(`[remove] done`, subscription);
    res.json(subscription);
  } catch (e) {
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
  }
};

const unsubscribe = async (req, res) => {
  console.group(`[subscriptions.controller] [unsubscribe]`);
  try {
    const {goodId} = req.body;
    if (!goodId) {
      throw new Error(`goodId required`);
    }
    const {vk} = req.user;
    if (!vk) {
      throw new Error(`vk required`);
    }

    const subscription = await subscriptionsService.removeWithProduct({goodId, userVk: vk});
    log(`[unsubscribe] done`, subscription);
    res.json(subscription);
  } catch (e) {
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
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
    res.json(subscription);
  } catch (e) {
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
  }
};

const save = async (req, res) => {
  console.group(`[subscriptions.controller] [save]`);
  try {
    const {id, price_discount, percent_discount, autobuy_price} = req.body;
    if (!id) {
      throw new Error(`id required`);
    }

    const subscription = await subscriptionsService.save({id, price_discount, percent_discount, autobuy_price});
    log(`[save] done`, subscription);
    res.json(subscription);
  } catch (e) {
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
  }
};

app.delete('/', remove);
app.delete('/unsubscribe', unsubscribe);
app.get('/', search);
app.post('/', save);

module.exports = app;