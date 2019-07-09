
exports.up = function(knex, Promise) {
  return knex.schema.table('subscriptions', table => {
    table.float('autobuy_price');
  });
  
};

exports.down = function(knex, Promise) {
  return knex.schema.table('subscriptions', table => {
    table.dropColumn('autobuy_price');
  });
};
