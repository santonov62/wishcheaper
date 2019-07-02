const db = require('./db.service');
const shopsService = require('./shops.service');

const log = (text, params = '') => {
  console.log(`[goods.service] -> ${text}`, params)
};

const search = async (params) => {
  const statementForSqlParams = [];
  const statementForSql = (param) => {
    statementForSqlParams.push(param);
    return `$${statementForSqlParams.length}`;
  };

  const SELECT = `SELECT * FROM goods`;
  let WHERE = ``;
  if (Object.keys(params).length > 0) {
    const {url, expireDate} = params;
    WHERE = ` WHERE true`;
    if (url) WHERE += ` AND "url" = ${statementForSql(url)}`;
    if (expireDate) {
      const paramIndex = statementForSql(expireDate);
      WHERE += ` AND "updated_at" < ${paramIndex} AND ("inactive_at" IS NULL OR "inactive_at" < ${paramIndex})`;
    }
  }
  const SEARCH_QUERY = SELECT + WHERE;
  const result = await db.query(SEARCH_QUERY, statementForSqlParams);
  const goods = result && result.rows;
  log('[search] done', goods);
  return goods;
};

const UPDATE_GOOD = `UPDATE goods 
SET
  "inactive_at" = NULL,
  "url" = $2,
  "title" = $3, 
  "logo" = $4, 
  "price" = $5, 
  "old_price" = $6,
  "updated_at" = $7,
  "prev_price" = $8
WHERE
  id = $1
RETURNING *`;
const update = async ({ id, url, title, logo, price, old_price, prev_price }) => {
  const result = await db.query(UPDATE_GOOD, [
    id,
    url,
    title,
    logo,
    price,
    old_price,
    new Date(),
    prev_price
  ]);
  const good = result.rows[0];
  log('[update] done', good);
  return good;
};

const ALL_GOODS = `SELECT * FROM goods`;
const getAll = async () => {
  const result = await db.query(ALL_GOODS);
  return result.rows;
};

const getShopIdByUrl = async (url) => {
  const shop = await shopsService.getShopByUrl(url);
  return shop.id;
}

const SAVE_GOOD = `INSERT INTO goods (
    url, title, logo, price, old_price, shop_id
) VALUES (
    $1, $2, 
    $3, $4, 
    $5, $6
) RETURNING *`;
const add = async ({ url, title, logo, price, old_price, shop_id }) => {
  if (!shop_id)
    shop_id = await getShopIdByUrl(url);

  const result = await db.query(SAVE_GOOD, [url, title, logo, price, old_price, shop_id]);
  const good = result.rows[0];
  log('[save] done', good);
  return good;
};

const ADD_URL = `INSERT INTO goods (
    url, shop_id
) VALUES (
    $1, $2
) RETURNING *`;
const addUrl = async ({ url }) => {
  const shop_id = await getShopIdByUrl(url);
  const result = await db.query(ADD_URL, [url, shop_id]);
  const good = result.rows[0];
  log('[addUrl] done', good);
  return good;
};

const SEARCH_USER_GOODS = `SELECT
   s.user_vk, s.good_id,
   g.url, g.title, g.logo, g.price, g.old_price, g.shop_id, g.created_at, g.updated_at, g.inactive_at, g.prev_price,
   sh.title shop_title, sh.name shop_name, sh.url shop_url
FROM
  subscriptions s
    LEFT JOIN goods g ON (g.id = s."good_id")
    LEFT JOIN shops sh ON (sh.id = g."shop_id")
WHERE
    s.user_vk = $1`;
const userGoods = async ({user_vk}) => {
  const result = await db.query(SEARCH_USER_GOODS, [user_vk]);
  return result.rows;
};

const INACTIVE_GOODS = `UPDATE goods
SET
  inactive_at = $2
WHERE
  id = $1
RETURNING *`;
const inactive = async ({id}) => {
  const result = await db.query(INACTIVE_GOODS, [id, new Date()]);
  log('[inactive] done', result.rows[0]);
  return result.rows[0];
};

const GOODS_STATISTIC = `SELECT count(*) as "goods_count",
       (SELECT count(*) FROM goods WHERE created_at > NOW() - interval '30 day') as "month_goods_count",
       (SELECT count(*) FROM users) as "users_count"
FROM goods`;

const statistic = async () => {
  const result = await db.query(GOODS_STATISTIC);
  return result && result.rows[0];
};

module.exports = {
  getAll,
  search,
  update,
  add,
  addUrl,
  userGoods,
  inactive,
  statistic
};
