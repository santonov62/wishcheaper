
exports.up = function(knex, Promise) {
  return knex.schema.table('goods', table => {
    table.dateTime('inactive_at');
  });
  
};

exports.down = function(knex, Promise) {
  return knex.schema.table('goods', table => {
    table.dropColumn('inactive_at');
  });
};
