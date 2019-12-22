'use strict';

module.exports = (sequelize, DataTypes) => {
  const Link = sequelize.define('Link', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('guest', 'user'),
      defaultValue: 'guest'
    },
    folder: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});

  Link.associate = function (models) {
    Link.belongsTo(models.User, {
      as: "User",
      foreignKey: "ownerId"
    });
  }

  return Link;
};