const express = require('express');
const app = express();
const subscriptionsService = require('../service/subscriptions.service');

// const goods = async (req, res) => {
//   try {
//     const {userVk} = req.query;
//     const subscriptionGoods = await subscriptionsService.searchWithGoods({user_vk: userVk});
//     res.json(subscriptionGoods);
//   } catch (e) {
//     res.status(500).json({error: e.message});
//   }
// };
//
// const log = (text, params) => {
//   console.log(`[subscriptions.controller] -> ${text}`, params);
// };
//
// app.get('/goods', goods);

module.exports = app;