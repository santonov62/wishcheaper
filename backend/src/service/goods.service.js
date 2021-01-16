const db = require('./db.service');
const shopsService = require('./shops.service');
const moment = require('moment');

const log = (text, params = '') => {
  console.log(`[goods.service] -> ${text}`, params)
};

// /*for get product with out additional data */
// const search = async (params) => {
//   const statementForSqlParams = [];
//   const statementForSql = (param) => {
//     statementForSqlParams.push(param);
//     return `$${statementForSqlParams.length}`;
//   };
//
//   const SELECT = `SELECT * FROM goods`;
//   let WHERE = ``;
//   if (Object.keys(params).length > 0) {
//     const {url, expireDate, id} = params;
//     WHERE = ` WHERE true`;
//     if (id) WHERE += ` AND "id" = ${statementForSql(id)}`;
//     if (url) WHERE += ` AND "url" = ${statementForSql(url)}`;
//     if (expireDate) {
//       const paramIndex = statementForSql(expireDate);
//       WHERE += ` AND "updated_at" < ${paramIndex} AND ("inactive_at" IS NULL OR "inactive_at" < ${paramIndex})`;
//     }
//   }
//   const SEARCH_QUERY = SELECT + WHERE;
//   const result = await db.query(SEARCH_QUERY, statementForSqlParams);
//   const goods = result && result.rows;
//   // log('[search] done', goods);
//   return goods;
// };

const UPDATE_GOOD = `UPDATE goods as g
SET
  "url" = $2,
  "title" = $3, 
  "logo" = $4, 
  "price" = $5, 
  "old_price" = $6,
  "updated_at" = $7,
  "prev_price" = $8,
  "inactive_at" = $9,
  "min_price" = $10,
  "currency" = $11
WHERE
  g.id = $1
RETURNING *`;
const update = async ({ id, url, title, logo, price, old_price, prev_price, inactive_at, min_price, currency }) => {
  const result = await db.query(UPDATE_GOOD, [
    id,
    url,
    title,
    logo,
    price,
    old_price,
    new Date(),
    prev_price,
    inactive_at,
    min_price,
    currency
  ]);
  const good = result.rows[0];
  // log('[update] done', good);
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
  // log('[save] done', good);
  return good;
};

const ADD_URL = `INSERT INTO goods (
    url, shop_id, inactive_at
) VALUES (
    $1, $2, $3
) RETURNING *`;
const addByUrl = async ({ url }) => {
  const shop_id = await getShopIdByUrl(url);
  const result = await db.query(ADD_URL, [url, shop_id, new Date()]);
  const good = result.rows[0];
  // log('[addByUrl] done', good);
  return good;
};

const BY_ID = `SELECT * FROM goods WHERE id = $1`;
const byId = async (id) => {
  const result = await db.query(BY_ID, [id]);
  return result.rows && result.rows[0];
};

const search = async (params) => {
  const statementForSqlParams = [];
  const statementForSql = (param) => {
    statementForSqlParams.push(param);
    return `$${statementForSqlParams.length}`;
  };
  
  const SELECT = `SELECT
   s.user_vk, s.good_id, s.id as subscription_id, s.price_discount, s.percent_discount, s.autobuy_price,
   g.id, g.url, g.title, g.logo, g.price, g.old_price, g.shop_id, g.created_at, g.updated_at, g.inactive_at, g.prev_price, g.min_price, round(100 - g.price / (g.old_price / 100)) as percentDiscount, g.currency,
   sh.title shop_title, sh.name shop_name, sh.url shop_url
FROM
  goods g
    LEFT JOIN subscriptions s ON s."good_id" = g.id
    LEFT JOIN shops sh ON (sh.id = g."shop_id")`;
  
  let WHERE = ``;
  let ORDER_BY = ``;
  if (Object.keys(params).length > 0) {
    let {vk, title, id, url, expireDate, shopId} = params;
    WHERE = ` WHERE true`;
    if (!!id) {
      WHERE += ` AND g.id = ${statementForSql(id)}`;
    } else {
      if (vk) WHERE += ` AND s.user_vk = ${statementForSql(vk)}`;
      if (title) {
        title = `%${title}%`;
        WHERE += ` AND LOWER(g.title) LIKE LOWER(${statementForSql(title)})`;
      }
      if (url) WHERE += ` AND g."url" = ${statementForSql(url)}`;
      if (expireDate) {
        const paramIndex = statementForSql(expireDate);
        WHERE += ` AND g."updated_at" < ${paramIndex} AND (g."inactive_at" IS NULL OR g."inactive_at" < ${paramIndex})`;
      }
      if (shopId) WHERE += ` AND g."shop_id" = ${statementForSql(shopId)}`;
      
      ORDER_BY = ` ORDER BY g.inactive_at DESC, g.price - g.prev_price, percentDiscount DESC NULLS LAST, g.updated_at DESC`;
    }
  }
  const LIMIT = ` LIMIT 99`;
  const SEARCH_QUERY = SELECT + WHERE + ORDER_BY + LIMIT;
  const result = await db.query(SEARCH_QUERY, statementForSqlParams);
  const goods = result && result.rows;
  return goods;
};

const INACTIVE_GOODS = `UPDATE goods
SET
  "inactive_at" = $2
WHERE
  id = $1
RETURNING *`;
const inactive = async ({id}) => {
  const result = await db.query(INACTIVE_GOODS, [id, new Date()]);
  // log('[inactive] done', result.rows[0]);
  return result.rows[0];
};

const GOODS_STATISTIC = `SELECT count(*) as "goods_count",
       (SELECT count(*) FROM goods WHERE created_at > NOW() - interval '7 day') as "week_goods_count",
       (SELECT count(*) FROM users) as "users_count"
FROM goods`;

const statistic = async () => {
  const result = await db.query(GOODS_STATISTIC);
  return result && result.rows[0];
};

const REMOVE_GOOD = `DELETE FROM goods
WHERE
  id = $1
RETURNING *`;
const remove = async({id}) => {
  const result = await db.query(REMOVE_GOOD, [id]);
  return result && result.rows[0];
};

const expired = async (shops) => {
  const SELECT = `SELECT * FROM goods`;
  let WHERE = ``;
  WHERE = ` WHERE false`;
  shops.forEach(({id, scan_interval = 720}) => {
    const expireDate = moment().subtract(scan_interval, "minutes").format();
    WHERE += ` OR (shop_id = ${id} AND "updated_at" < '${expireDate}' AND ("inactive_at" IS NULL OR "inactive_at" < '${expireDate}'))`;
  });
  const QUERY = SELECT + WHERE;
  const result = await db.query(QUERY);
  return result && result.rows;
};

const ADDITIONAL_GOOD_DATA = `SELECT
  g.id as good_id,
  su.id as subscription_id,
  su.price_discount,
  su.percent_discount,
  su.price_discount,
  su.percent_discount,
  sh.name as shop_name
FROM goods g
       LEFT JOIN subscriptions as su ON su.good_id = g.id AND su.user_vk = $2
       LEFT JOIN shops as sh ON sh.id = g.shop_id
WHERE
    g.id = $1`;
const additionalGoodData = async ({id, user_vk}) => {
  const result = await db.query(ADDITIONAL_GOOD_DATA, [id, user_vk]);
  return result.rows && result.rows[0];
};

module.exports = {
  getAll,
  search,
  update,
  add,
  addByUrl,
  inactive,
  statistic,
  remove,
  expired,
  byId,
  additionalGoodData,
};
