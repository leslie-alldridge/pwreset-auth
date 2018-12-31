const environment = process.env.NODE_ENV || "development";
const config = require("../../knexfile")[environment];
const knex = require("knex")(config);

module.exports = {
  createUser,
  findUser,
  userExists,
  userResetReq,
  deleteUser
};

function createUser(data, testDb) {
  const connection = testDb || knex;
  return connection("users").insert({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    username: data.username,
    password: data.password
  });
}

function findUser(email, testDb) {
  const connection = testDb || knex;
  return connection("users")
    .where("email", email)
    .then(data => {
      if (data.length > 0) {
        return data;
      } else {
        return null;
      }
    });
}

function userExists(name, testDb) {
  const connection = testDb || knex;
  return connection("users")
    .where("username", name)
    .first();
}

function userResetReq(email, token, date, testDb) {
  const connection = testDb || knex;
  return connection("users")
    .where("email", email)
    .update({
      resetPasswordToken: token,
      resetPasswordExpires: date
    })
    .then(data => console.log(data));
}

function deleteUser(user, testDb) {
  const connection = testDb || knex;
  return connection("users")
    .where("username", user)
    .del()
}