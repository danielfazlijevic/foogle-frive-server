require('dotenv').config();

module.exports = {
  development: {
    url: "postgres://daniel:daniel123@localhost:5432/fglfrive",
    dialect: 'postgres',
  },
  test: {
    url: "postgres://daniel:daniel123@localhost:5432/fglfrive",
    dialect: 'postgres',
  },
  production: {
    url: "postgres://daniel:daniel123@localhost:5432/fglfrive",
    dialect: 'postgres',
  },
};
