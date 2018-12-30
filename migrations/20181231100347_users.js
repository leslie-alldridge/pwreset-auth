exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", table => {
    table.increments("id");
    table.string("username");
    table.string("password");
    table.boolean("admin");
    table.timestamp("created_at");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};
