const db = require('./db.service');

const byVk = async (vk) => {
  return await search({vk});
};

const search = async (params) => {

  const statementForSqlParams = [];
  const statementForSql = (param) => {
    statementForSqlParams.push(param);
    return `$${statementForSqlParams.length}`;
  };

  const SELECT = `SELECT * FROM users`;
  let WHERE = ``;
  if (Object.keys(params).length > 0) {
    const {vk, id, login} = params;
    WHERE = ` WHERE true`;
    if (vk) WHERE += ` AND "vk" = ${statementForSql(vk)}`;
    if (id) WHERE += ` AND "id" = ${statementForSql(id)}`;
    if (login) WHERE += ` AND "login" = ${statementForSql(login)}`;
  }
  const SEARCH_QUERY = SELECT + WHERE;
  // console.log('Search users query: ', SEARCH_QUERY);
  const result = await db.query(SEARCH_QUERY, statementForSqlParams);
  const user = result && result.rows[0];
  log('search', user);
  return user;
};

const SAVE_PROMO = `INSERT INTO users (
    name, vk,
    photo, email
) VALUES (
    $1, $2, 
    $3, $4
) RETURNING *`;
const save = async ({name, vk, photo, email}) => {
  const result = await db.query(SAVE_PROMO, [
    name,
    vk,
    photo,
    email
  ]);
  return result.rows[0];
};
const log = (text, params) => {
  console.log(`[user.service] ${text}`, params);
};
module.exports = {
  search: search,
  save: save,
};