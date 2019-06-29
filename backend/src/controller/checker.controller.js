const express = require('express');
const checkerService = require('../service/checker/checker.service');
const app = express();

const refresh = async (req, res) => {
  try {
    const { goodId } = req.query;
    const good = await checkerService.refresh(goodId);
    log(`[refresh] goodId: ${goodId}`, good);
    res.json(good);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
};

const start = async (req, res) => {
  try {
    const checker = await checkerService.start();
    log(`[start]`);
    res.json(checker);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
};

const stop = async (req, res) => {
  try {
    const checker = await checkerService.stop();
    log(`[stop]`);
    res.json(checker);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
};

const status = async (req, res) => {
  try {
    const checker = await checkerService.status();
    log(`[status]`);
    res.json(checker);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
};

const log = (text, params = '') => {
  console.log(`[checker.controller] ${text}`, params);
};

app.get('/refresh', refresh);
app.get('/start', start);
app.get('/stop', stop);
app.get('/status', status);

module.exports = app;