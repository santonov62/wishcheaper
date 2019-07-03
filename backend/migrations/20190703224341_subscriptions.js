
exports.up = function(knex, Promise) {
  return knex.schema.table('subscriptions', table => {
    table.float('price_discount');
    table.integer('percent_discount');
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table('subscriptions', table => {
    table.dropColumn('price_discount');
    table.dropColumn('percent_discount');
  });
};
