'use strict';
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => 
{
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Invalid Username. Must be between 1 and 99 chars.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 99],
          msg: "Password must be at least 8 characters."
        }
      }
    },
    accountType:{
      type: DataTypes.STRING
    }
  }, {});

  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Link, {as: "User", constraints: false});
    User.hasMany(models.Link, {as: "AccessTo", constraints: false});
  };
 

  User.prototype.validPassword = function(password) {
    console.log('comparing password', password);
    return bcrypt.compareSync(password, this.password);
  };

  // Function to remove the password before sending the User to the session
  User.prototype.toJSON = function () {
    const userData = this.get();
    delete userData.password;
    return userData;
  };
  return User;
};