const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const checkerService = require('../service/checker/checker.service');
const goodsService = require('../service/goods.service');
const subscriptionService = require('../service/subscriptions.service');
const socketService = require('../service/socket.service');
const app = express();

const start = async (req, res) => {
  console.group(`[checker.controller] -> [start]`);
  try {
    const checker = await checkerService.start();
    res.json(checker);
  } catch (e) {
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
  }
};

const stop = async (req, res) => {
  console.group(`[checker.controller] -> [stop]`);
  try {
    const checker = await checkerService.stop();
    res.json(checker);
  } catch (e) {
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
  }
};

const status = async (req, res) => {
  console.group(`[checker.controller] -> [status]`);
  try {
    const checker = await checkerService.status();
    res.json(checker);
  } catch (e) {
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
  }
};

const add = async (req, res) => {
  console.group(`[checker.controller] -> [add]`);
  try {
    const {url} = req.body;
    const {user} = req;
    const good = await checkerService.add({url, user});
    res.json(good);
  } catch (e) {
    console.error(e);
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
  }
};

const scan = async (req, res) => {
  console.group(`[checker.controller] -> [scan]`);
  try {
    const checker = await checkerService.scan();
    res.json(checker);
  } catch (e) {
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
  }
};

const log = (text, params = '') => {
  console.log(`[checker.controller] ${text}`, params);
};

// app.get('/check', authMiddleware.authRequired, check);
app.get('/start', authMiddleware.adminAuthRequired, start);
app.get('/stop', authMiddleware.adminAuthRequired, stop);
app.get('/status', authMiddleware.adminAuthRequired, status);
app.post('/add', authMiddleware.authRequired, add);
app.get('/scan', authMiddleware.authRequired, scan);

module.exports = app;