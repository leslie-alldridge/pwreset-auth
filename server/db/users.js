const environment = process.env.NODE_ENV || "development";
const config = require("../../knexfile")[environment];
const knex = require("knex")(config);

module.exports = {
    createUser
  };

  function createUser(data, testDb) {
    const connection = testDb || knex;
    return connection("users").insert({
    //   first_name: data.first_name,
    //   last_name: data.last_name,
    //   email: data.email,
    //   username: data.username
    data
    });
  }