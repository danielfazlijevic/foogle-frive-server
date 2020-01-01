require('dotenv').config();

module.exports = {
  development: {
    url: "postgres://daniel:daniel123@localhost:5432/fglfrive",
    dialect: 'postgres',
  },
  test: {
    url: "LOAD_ME_FROM_ENV",
    dialect: 'postgres',
  },
  production: {
    url: "LOAD_ME_FROM_ENV",
    dialect: 'postgres',
  },
};
