const db = require('./db.service');
const goodsService = require('./goods.service');

const log = (text, params = '') => {
  console.log(`[subscriptions.service] -> ${text}`, params)
};

const ADD_SUBSCRIPTION = `INSERT INTO subscriptions (
  good_id, user_id, user_vk
) VALUES (
  $1, $2, $3
)`;
const add = async ({good_id, user_id, user_vk}) => {
  const result = await db.query(ADD_SUBSCRIPTION, [good_id, user_id, user_vk]);
  const subsription = result.rows[0];
  log(`[add] done`, subsription);
  return subsription;
};

const search = async (params) => {
  const statementForSqlParams = [];
  const statementForSql = (param) => {
    statementForSqlParams.push(param);
    return `$${statementForSqlParams.length}`;
  };

  const SELECT = `SELECT * FROM subscriptions`;
  let WHERE = ``;
  if (Object.keys(params).length > 0) {
    const {good_id, user_id, user_vk} = params;
    WHERE = ` WHERE true`;
    if (good_id) WHERE += ` AND "good_id" = ${statementForSql(good_id)}`;
    if (user_id) WHERE += ` AND "user_id" = ${statementForSql(user_id)}`;
    if (user_vk) WHERE += ` AND "user_vk" = ${statementForSql(user_vk)}`;
  }
  const SEARCH_QUERY = SELECT + WHERE;
  const result = await db.query(SEARCH_QUERY, statementForSqlParams);
  const subscriptions = result && result.rows;
  log('[search] done', subscriptions);
  return subscriptions;
};

const SEARCH_WITH_GOODS =   `SELECT * FROM
  subscriptions s
LEFT JOIN goods g ON (g.id = s."good_id")
WHERE
    s.user_vk = $1`;
const searchWithGoods = async ({user_vk}) => {
  const result = await db.query(SEARCH_WITH_GOODS, [user_vk]);
  return result.rows;
};

const SUBSCRIPTIONS_REMOVE = `DELETE FROM subscriptions
WHERE
  good_id = $1 AND user_vk = $2
RETURNING *`;
const remove = async({goodId, userVk}) => {
  const result = await db.query(SUBSCRIPTIONS_REMOVE, [goodId, userVk]);
  const otherSubscriptions = await search({good_id: goodId});
  if (!!otherSubscriptions && !otherSubscriptions[0]) {
    const good = await goodsService.remove({id: goodId});
  }
  return result.rows && result.rows[0];
};

module.exports = {
  add,
  search,
  searchWithGoods,
  remove
};