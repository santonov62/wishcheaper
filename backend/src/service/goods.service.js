const db = require('./db.service');
const shopsService = require('./shops.service');

const log = (text, params = '') => {
  console.log(`[goods.service]: ${text}`, params)
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
    const {url} = params;
    WHERE = ` WHERE true`;
    if (url) WHERE += ` AND "url" = ${statementForSql(url)}`;
  }
  const SEARCH_QUERY = SELECT + WHERE;
  const result = await db.query(SEARCH_QUERY, statementForSqlParams);
  const good = result && result.rows[0];
  log('[search] done', good);
  return good;
};

const UPDATE_GOOD = `UPDATE goods 
SET 
  "url" = $2,
  "title" = $3, 
  "logo" = $4, 
  "price" = $5, 
  "old_price" = $6,
  "updated_at" = $7
WHERE 
  id = $1
RETURNING *`;
const update = async ({ id, url, title, logo, price, old_price }) => {
  const result = await db.query(UPDATE_GOOD, [
    id,
    url,
    title,
    logo,
    price,
    old_price,
    new Date()
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

const SAVE_GOOD = `INSERT INTO goods (
    url, title, logo, price, old_price, shop_id
) VALUES (
    $1, $2, 
    $3, $4, 
    $5, $6
) RETURNING *`;
const add = async ({ url, title, logo, price, old_price, shop_id }) => {
  if (!shop_id) {
    const shop = await shopsService.getShopByUrl(url);
    shop_id = shop.id;
  }
  const result = await db.query(SAVE_GOOD, [url, title, logo, price, old_price, shop_id]);
  const good = result.rows[0];
  log('[save] done', good);
  return good;
};

module.exports = {
  getAll,
  search,
  update,
  add
};
