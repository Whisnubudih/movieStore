'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Movie)
      User.hasOne(models.Profile)
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: `Fill the username!` }
      },
      unique: {
          args: true,
          msg: 'username already in use!'
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: `Fill the email!` },
        isEmail: { msg: `Use the correct email` }
      },
      unique: {
          args: true,
          msg: 'Email address already in use!'
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: `Fill the password!` },
        pw(password) {
          if (password) {
            if (password.length < 8) {
              throw new Error('The password must contain 8 charaters')
            }
          }
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: `Fill the role!` }
      }
    },
  }, {
    sequelize,
    hooks: {
      beforeCreate: (instance, options) => {

        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(instance.password, salt);

        instance.password = hash
        instance.role = 'User'

      }
    },
    modelName: 'User',
  });


  return User;
};