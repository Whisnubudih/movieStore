'use strict';
const fs = require('fs')
module.exports = {
  up:  (queryInterface, Sequelize) => {
    
   let data = JSON.parse(fs.readFileSync('./data/movies.json','utf8'))
   data.forEach(el => {
     delete el.id 
     el.createdAt = new Date()
     el.updatedAt = new Date()

   });
   return queryInterface.bulkInsert('Movies',data)
  },

  down:  (queryInterface, Sequelize) => {
    
     return queryInterface.bulkDelete('Movies',null)
  }
};
