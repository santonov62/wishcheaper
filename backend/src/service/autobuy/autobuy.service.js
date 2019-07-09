const pandaoAutobuy = require('./pandaoAutobuy.service');
const goodsService = require('../goods.service');
const vkService = require('../vk.service');
const db = require('../db.service');
const subscriptionService = require('../subscriptions.service');
const shopsService = require('../shops.service');

const moment = require('moment');
const autobuyList = [
  pandaoAutobuy
];

const buy = ({}) => {

};

const getCheckerForUrl = (url) => {
  return checkerList.find(checker => checker.isMyUrl(url));
};

module.exports = {
  buy
};