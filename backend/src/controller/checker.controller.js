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


const getClippedUrl = (url) => {
  const match = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#//=]*)/g);
  return match && match[0];
};

const add = async (req, res) => {
  console.group(`[checker.controller] -> [add]`);
  try {
    let {url} = req.body;
    
    url = checkerService.getClippedUrl(url);
    if (!url) {
      throw new Error(`incorrect url`)
    }
    
    const {user} = req;
    let good = (await goodsService.search({url}))[0];
    if (!good) {
      good = await checkerService.addByUrl(url);
    }
    
    if (good) {
      let subscriptions = await subscriptionService.search({
        good_id: good.id,
        user_vk: user.vk
      });
      if (subscriptions.length === 0)
        await subscriptionService.add({
          good_id: good.id,
          user_id: user.id,
          user_vk: user.vk
        });
    }
    
    checkerService.refresh(good)
      .then(async good => {
        const additionalData = await checkerService.additionalGoodData({...good, user_vk: user.vk});
        good = {
          ...good,
          ...additionalData
        };
        socketService.emitAll(`good`, good);
      });
    
    res.json(good);
  } catch (e) {
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