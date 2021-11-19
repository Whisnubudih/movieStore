'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User)
    }

    get formatName() {
      if (this.gender == 'Male') {
        return `Mr.${this.name}`;
      } else if (this.gender == 'Female') {
        return `Ms.${this.name}`;
      }
    }

    get formatDate() {
      return this.dateFound = (new Date().getYear()) - (this.dateFound.getYear());
    }
  };
  Profile.init({
    name: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {msg : `fill the description!`}
      }
    }, 
    age: {
      type : DataTypes.INTEGER,
      validate : {
        notEmpty : {msg : `fill the price!`}
      }
    },
    address: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {msg : `fill the addres!`}
      }
    },
    gender: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {msg : `fill the gender`}
      }
    },
    UserId: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {msg : `fill the UserId!`}
      }
    },
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};