
exports.up = function(knex, Promise) {
  return knex.schema.table('goods', table => {
    table.float('min_price');
  });
  
};

exports.down = function(knex, Promise) {
  return knex.schema.table('goods', table => {
    table.dropColumn('min_price');
  });
};
