const express = require('express');
const app = express();
const goodsService = require('../service/goods.service');
const subscriptionsService = require('../service/subscriptions.service');
const authMiddleware = require('../middleware/auth.middleware');


const getAll = async(req, res) => {
  console.group(`[goods.controller] -> [getAll]`);
  try {
    const goods = await goodsService.search();
    res.json(goods);
  } catch (e) {
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
  }
};

const search = async (req, res) => {
  console.group(`[goods.controller] -> [search]`);
  try {
    const goods = await goodsService.search({...req.query});
    res.json(goods);
  } catch (e) {
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
  }
};

const my = async (req, res) => {
  console.group(`[goods.controller] -> [my]`);
  try {
    const {vk} = req.user;
    const userGoods = await goodsService.userGoods({vk, ...req.query});
    res.json(userGoods);
  } catch (e) {
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
  }
};

const statistic = async (req, res) => {
  console.group(`[goods.controller] -> [statistic]`);
  try {
    const statistic = await goodsService.statistic();
    res.json(statistic);
  } catch (e) {
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
  }
};

const remove = async (req, res) => {
  console.group(`[goods.controller] -> [remove]`);
  try {
    const {id} = req.body;
    if (!id) {
      throw new Error(`id required`);
    }
    const good = await goodsService.remove({id});
    log(`[remove] done`, good);
    res.json(good);
  } catch (e) {
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
  }
};

const log = (text, params) => {
  console.log(`[goods.controller] -> ${text}`, params);
};

app.get('/', getAll);
// app.delete('/', authMiddleware.authRequired, remove);
app.get('/search', search);
app.get('/my', authMiddleware.authRequired, my);
app.get('/statistic', statistic);

module.exports = app;