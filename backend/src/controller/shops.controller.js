const express = require('express');
const app = express();
const shopService = require('../service/shops.service');
// const imageUpload = require('../middleware/imageUpload.middleware');
const authMiddleware = require('../middleware/auth.middleware');


const log = (text, params = '') => {
  console.log(`[shops.controller] -> ${text}`, params);
};

const getAll = async(req, res) => {
  console.group(`[shops.controller]: [getAll]`);
  try {
    const shops = await shopService.getAll();
    log('[getAll] done', shops);
    res.json(shops);
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    console.groupEnd();
  }
};
app.get('/', getAll);

const myShops = async(req, res) => {
  console.group(`[shops.controller]: [myShops]`);
  try {
    const {vk} = req.user;
    const shops = await shopService.myShops({vk});
    log('[myShops] done', shops);
    res.json(shops);
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    console.groupEnd();
  }
};
app.get('/myShops', authMiddleware.authRequired, myShops);

const update = async(req, res) => {
  console.group(`[shops.controller]: [getAll]`);
  try {
    const {id, scanInterval} = req.body;
    const shop = await shopService.update({id, scanInterval});
    res.json(shop);
  } catch (ex) {
    res.status(500).json({ message: ex.message });
  } finally {
    console.groupEnd();
  }
};
app.put('/', authMiddleware.adminAuthRequired, update);

// app.put('/', authMiddleware.adminAuthRequired, imageUpload.single('logo'), async(req, res) => {
//   try {
//     const preparedShop = prepareShopForSave(req);
//     const shop = (await shopService.update(preparedShop)).rows[0];
//     res.json({ ...shop });
//   } catch (ex) {
//     res.status(400).json({ message: ex.message });
//   }
// });

// app.delete('/', authMiddleware.adminAuthRequired, async (req, res) => {
//   try {
//     const id = Number(req.query.id);
//     const shop = await shopService.delete({id});
//     res.json({...shop});
//   } catch (e) {
//     res.status(400).json({
//       error: e.message
//     })
//   }
// });

module.exports = app;
