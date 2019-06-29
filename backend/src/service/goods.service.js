const db = require('./db.service');

const GOOD_BY_ID = `SELECT *
FROM goods
WHERE 
  id = $1`;
const search = async ({ id }) => {
  const result = await db.query(GOOD_BY_ID, [id]);
  return result.rows[0];
};

const UPDATE_GOOD = `UPDATE goods 
SET 
  "url" = $2,
  "title" = $3, 
  "logo" = $4, 
  "price" = $5, 
  "discount_price" = $6
WHERE 
  id = $1
RETURNING *`;
const update = async ({ id, url, title, logo, price, discount_price }) => {
  const result = await db.query(UPDATE_GOOD, [
    id,
    url,
    title,
    logo,
    price,
    discount_price
  ]);
  return result.rows[0];
};

module.exports = {
  search,
  update
};
