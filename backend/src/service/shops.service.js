const db = require('./db.service');

const SAVE_SHOP = `INSERT INTO shops (
  title, url, logo
) VALUES (
  $1, $2, $3
) RETURNING *`;
const save = async ({title, url, logo}) => {
  const result = await db.query(SAVE_SHOP, [
    title,
    url,
    logo
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
  getShopByUrl
};