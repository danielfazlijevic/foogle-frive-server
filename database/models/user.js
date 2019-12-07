'use strict';
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Invalid User name. Must be between 1 and 99 chars.'
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
    }
  }, {});

  User.associate = function (models) {
    // associations can be defined here
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