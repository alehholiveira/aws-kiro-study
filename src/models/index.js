const { sequelize } = require('../config/database');
const Winner = require('./Winner');
const Match = require('./Match');

const models = {
  Winner,
  Match
};

// Set up associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};
