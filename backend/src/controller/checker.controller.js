const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const checkerService = require('../service/checker/checker.service');
const goodsService = require('../service/goods.service');
const app = express();

const refresh = async (req, res) => {
  try {
    const { goodId } = req.query;
    const good = await goodsService.search({ id: goodId });
    const refreshedGood = await checkerService.refresh(good);
    res.json(refreshedGood);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
};

const start = async (req, res) => {
  try {
    const checker = await checkerService.start();
    res.json(checker);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
};

const stop = async (req, res) => {
  try {
    const checker = await checkerService.stop();
    res.json(checker);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
};

const status = async (req, res) => {
  try {
    const checker = await checkerService.status();
    res.json(checker);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
};

const add = async (req, res) => {
  try {
    const {url} = req.body;
    const good = await goodsService.search({url});
    if (good)
      return res.json(good);

    const addedGood = await checkerService.addByUrl({url});

    res.json(addedGood);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
};

const log = (text, params = '') => {
  console.log(`[checker.controller] ${text}`, params);
};

app.get('/refresh', authMiddleware.authRequired, refresh);
app.get('/start', authMiddleware.adminAuthRequired, start);
app.get('/stop', authMiddleware.adminAuthRequired, stop);
app.get('/status', authMiddleware.adminAuthRequired, status);
app.post('/add', authMiddleware.authRequired, add);

module.exports = app;