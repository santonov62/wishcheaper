
exports.up = async function (knex, Promise) {

  const shops = await knex.schema.createTable('shops', table => {
    table.increments();
    table.text('title');
    table.text('name');
    table.text('url');
    table.text('logo');
  });

  const goods = await knex.schema.createTable('goods', table => {
    table.increments();
    table.text('url').notNullable();
    table.text('title');
    table.text('logo');
    table.float('price');
    table.float('old_price');
    table.integer('shop_id').notNullable()
      .references('id').inTable('shops');
    table.timestamps(true, true);
  });

  const users = await knex.schema.createTable('users', table => {
    table.increments();
    table.text('name');
    table.integer('vk');
    table.text('logo');
    table.text('email');
    table.text('photo');
    table.integer('admin');
    table.timestamps(true, true);
  });

  const subscriptions = await knex.schema.createTable('subscriptions', table => {
    table.increments();
    table.integer('good_id').notNullable()
      .references('id').inTable('goods');
    table.integer('user_id').notNullable()
      .references('id').inTable('users');
    table.integer('user_vk');
    table.timestamps(true, true);
  });

  const prices = await knex.schema.createTable('prices', table => {
    table.increments();
    table.integer('good_id').notNullable()
      .references('id').inTable('goods');
    table.float('price');
    table.dateTime('last_checked_at');
    table.timestamps(true, true);
  });

  return Promise.all([shops, goods, users, subscriptions, prices]);
};

exports.down = async function (knex, Promise) {
  const subscriptions = await knex.schema.dropTable('subscriptions');
  const prices = await knex.schema.dropTable('prices');
  const goods = await knex.schema.dropTable('goods');
  const users = await knex.schema.dropTable('users');
  const shops = await knex.schema.dropTable('shops');
  return Promise.all([subscriptions, prices, goods, users, shops]);
};
