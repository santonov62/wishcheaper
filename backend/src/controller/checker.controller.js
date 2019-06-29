const express = require('express');
const checkerService = require('../service/checker/checker.service');
const app = express();

const refresh = async (req, res) => {
  try {
    const { goodId } = req.query;
    const good = await checkerService.refresh(goodId);
    log(`[refresh] ${goodId}`, good);
    res.json(good);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
};

const log = (text, params) => {
  console.log(`[checker.controller] ${text}`, params);
};

app.get('/refresh', refresh);

module.exports = app;