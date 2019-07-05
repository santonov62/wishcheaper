const db = require('./db.service');

const ALL_SHOPS = `SELECT * FROM shops`;
const getAll = async () => {
  const result = await db.query(ALL_SHOPS);
  return result && result.rows;
};

const SAVE_SHOP = `INSERT INTO shops (
  title, url, logo, name
) VALUES (
  $1, $2, $3, $4
) RETURNING *`;
const save = async ({title, url, logo, name}) => {
  const result = await db.query(SAVE_SHOP, [
    title,
    url,
    logo,
    name
  ]);
  return result.rows[0];
};

const SHOP_BY_URL = `SELECT * FROM shops WHERE url LIKE $1`;
const getShopByUrl = async (url) => {
  const regexp = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/gm
  const [shopUrl, name] = regexp.exec(url);
  const result = await db.query(SHOP_BY_URL, [`%${name}%`]);
  return result.rows[0];
};

module.exports = {
  save,
  getShopByUrl,
  getAll
};