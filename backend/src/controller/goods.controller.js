const express = require('express');
const app = express();
const goodsService = require('../service/goods.service');

const getAll = async(req, res) => {
  const goods = await goodsService.search();
  res.json(goods);
};

const log = (text, params) => {
  console.log(`[goods.controller] ${text}`, params);
};

app.get('/', getAll);

module.exports = app;