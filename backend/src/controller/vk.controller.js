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
    // {
    //   "type": "message_new",
    //     "object": {
    //   "id": 8318,
    //       "date": 1609326083,
    //       "out": 0,
    //       "user_id": 2758589,
    //       "read_state": 0,
    //       "title": "",
    //       "body": "324234234",
    //       "owner_ids": []
    // },
    //   "group_id": 183983399,
    //     "event_id": "03eeb977e94bd1604533b79a77751db6b8798527",
    //     "secret": "mNrFM3EPU9nmqA4g8UQs"
    // }
    const { type, secret } = req.body;
    if (type === 'confirmation') {
        res.send(process.env.VK_CALLBACK_API_CONFIRMATION);
        return;
    }
    const {object: { body, user_id }} = req.body;
    if (type === "message_new") {

    }
    res.send('ok');
  } catch (e) {
    res.status(500).json({error: e.message});
  } finally {
    console.groupEnd();
  }
};

app.post('/', callbackApi);

module.exports = app;