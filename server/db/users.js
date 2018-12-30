const environment = process.env.NODE_ENV || "development";
const config = require("../../knexfile")[environment];
const knex = require("knex")(config);

module.exports = {
  createUser,
  findUser,
  userExists
};

function createUser(data, testDb) {
    console.log(data);
    
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

  console.log("hit find user");
  return connection("users").where('email', email).then(data => {
      if (data.length > 0){
          console.log('found a user');
          
          return data 
      } else {
        console.log('found nothing');

          return null
      }
  });
}

function userExists(name, testDb) {
    const connection = testDb || knex;

    console.log("hit find user");
    return connection("users").where('username', name).first();
}
