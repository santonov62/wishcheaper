const express = require('express');
const app = express();
const goodsService = require('../service/goods.service');
const subscriptionsService = require('../service/subscriptions.service');

const getAll = async(req, res) => {
  const goods = await goodsService.search();
  res.json(goods);
};

const search = async (req, res) => {
  try {
    const {vk} = req.query;
    const goods = await goodsService.search({vk});
    res.json(goods);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
};

const my = async (req, res) => {
  try {
    const {vk} = req.query;
    const subscriptionGoods = await goodsService.userGoods({user_vk: vk});
    res.json(subscriptionGoods);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
};

const statistic = async (req, res) => {
  try {
    const statistic = await goodsService.statistic();
    res.json(statistic);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
};

const remove = async (req, res) => {
  console.group(`[goods.controller] [delete]`);
  try {
    const {id} = req.body;
    if (!id) {
      throw new Error(`id required`);
    }
    const good = await goodsService.remove({id});
    log(`[remove] done`, good);
    console.groupEnd();
    res.json(good);
  } catch (e) {
    console.groupEnd();
    res.status(500).json({error: e.message});
  }
};

const log = (text, params) => {
  console.log(`[goods.controller] -> ${text}`, params);
};

app.get('/', getAll);
app.delete('/', remove);
app.get('/search', search);
app.get('/my', my);
app.get('/statistic', statistic);

module.exports = app;