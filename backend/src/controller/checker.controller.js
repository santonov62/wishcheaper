const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const checkerService = require('../service/checker/checker.service');
const goodsService = require('../service/goods.service');
const subscriptionService = require('../service/subscriptions.service');
const vkService = require('../service/vk.service');
const app = express();

// const check = async (req, res) => {
//   try {
//     const { goodId } = req.query;
//     if (!goodId)
//       throw new Error(`goodId required.`);
//
//     const {url} = (await goodsService.search({ id: goodId }))[0];
//     const good = await checkerService.refresh({url});
//     res.json(good);
//   } catch (e) {
//     res.status(500).json({error: e.message});
//   }
// };

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


const getClippedUrl = (url) => {
  const match = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#//=]*)/g);
  return match && match[0];
};

const add = async (req, res) => {
  try {
    let {url} = req.body;
    
    url = getClippedUrl(url);
    if (!url) {
      throw new Error(`incorrect url`)
    }
    
    const {user} = req;
    let good = (await goodsService.search({url}))[0];
    if (!good) {
      good = await checkerService.addUrl(url);
    }
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
  
    const additionalData = await checkerService.additionalGoodData({...good, user_vk: user.vk});
    good = {
      ...good,
      ...additionalData
    };
    
    res.json(good);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
};

const scan = async (req, res) => {
  try {
    const checker = await checkerService.scan();
    res.json(checker);
  } catch (e) {
    res.status(500).json({error: e.message});
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