
exports.up = function(knex, Promise) {
  return knex.schema.table('goods', table => {
    table.text('currency');
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table('goods', table => {
    table.dropColumn('currency');
  });
};
