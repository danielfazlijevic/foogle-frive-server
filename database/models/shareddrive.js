'use strict';

module.exports = (sequelize, DataTypes) => {
  const SharedDrive = sequelize.define('SharedDrive', {
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

  SharedDrive.associate = function (models) {
    SharedDrive.belongsTo(models.User, { as: "User", foreignKey: "ownerId"});
    SharedDrive.hasMany(models.User, { as: "SharedTo", constraints: false});
  }
 
  return SharedDrive;
};