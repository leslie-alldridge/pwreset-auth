exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", table => {
    table.increments("id");
    table.string("username");
    table.string("email");
    table.string("first_name");
    table.string("last_name");
    table.binary('password');
    table.binary('resetPasswordToken');
    table.string('resetPasswordExpires');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};
