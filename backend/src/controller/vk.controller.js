const express = require('express');
const app = express();

const log = (text, params) => {
  console.log(`[vk.controller] -> ${text}`, params);
};

const callbackApi = async (req, res) => {
  console.group(`[vk.controller] [callbackApi]`);
  try {
    log(req.body);
    // { "type": "confirmation", "group_id": 183983399 }
    const { type, group_id } = req.body;
    if (type === 'confirmation') {
        res.json('b8660ca3');
    }
    res.json('ok');
  } catch (e) {
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
  }
};

app.post('/', callbackApi);

module.exports = app;