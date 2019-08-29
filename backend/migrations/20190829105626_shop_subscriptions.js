
exports.up = function(knex, Promise) {
  
  return knex.schema.createTable('shop_subscriptions', table => {
    table.increments();
    table.integer('shop_id').notNullable()
        .references('id').inTable('shops');
    table.integer('percent_discount').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('shop_subscriptions');
};
