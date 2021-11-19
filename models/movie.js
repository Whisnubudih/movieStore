'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Movie.belongsTo(models.User)
      Movie.belongsTo(models.Category)
    }
    
    static getMovieByType(sort) {
      if (sort == 'DESC') {
        return {
          include: 'Category',
          order: [
            ['price', sort]
        ]
        }
      } else if (sort == 'ASC') {
        return {
          include: 'Category',
          order: [
            ['price', sort]
        ]
        }
      } 
    }

    get formatMovieName() {
      if (this.type == 'Premiere') {
        return `🔥 ${this.name} 🔥`
      } else {
        return `⭐ ${this.name} ⭐`
      }
    }
  };
  Movie.init({
    name: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {msg : `Fill the name!`}
      }
    },
    description: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {msg : `Fill the description!`}
      }
    },
    price: {
      type : DataTypes.INTEGER,
      validate : {
        notEmpty : {msg : `Fill the price!`},
        min: {args: 100000,msg : `The price so awful, please spank with minimal Rp 100.000`}
      }
    },
    imageUrl: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {msg : `Fill the imageUrl!`},
        isUrl: {msg : `Please url!`},

      }
    },
    type: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {msg : `Fill the type!`}
      }
    },
    stock: {
      type : DataTypes.INTEGER,
      validate : {
        notEmpty : {msg : `Fill the stock!`}
      }
    },
    UserId: {
      type : DataTypes.INTEGER,
      validate : {
        notEmpty : {msg : `Fill the UserId!`}
      }
    },
    CategoryId: {
      type : DataTypes.INTEGER,
      validate : {
        notEmpty : {msg : `Fill the CategoryId!`}
      }
    }
  }, {
    sequelize,
    hooks: {
      beforeCreate : (instance, options) => {
      
          if(instance.price < 1000000) {
            instance.type = `Box Office`
          } else {
            instance.type = `Premiere`
          }
        }
    },
    modelName: 'Movie',
  });
  return Movie;
};