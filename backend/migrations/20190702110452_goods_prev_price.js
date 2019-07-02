
exports.up = function(knex, Promise) {
  return knex.schema.table('goods', table => {
    table.float('prev_price');
  });
  
};

exports.down = function(knex, Promise) {
  return knex.schema.table('goods', table => {
    table.dropColumn('prev_price');
  });
};
