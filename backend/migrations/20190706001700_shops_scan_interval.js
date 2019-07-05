
exports.up = function(knex, Promise) {
  return knex.schema.table('shops', table => {
    table.integer('scan_interval');
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table('shops', table => {
    table.dropColumn('scan_interval');
  });
};
