/**
 * Author.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    // id в mysql базе    
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // id в базе vk, tw, fb
    src_id: {
      type: Sequelize.STRING,
      allowNull: false      
    },
    // имя автора    
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    // адрес страницы автора
    url: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    // общее количество друзей или follower'ов
    friends_count: {
      type: Sequelize.INTEGER,
      allowNull: false
    }

  },

  options: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    freezeTableName: false,
    tableName: 'authors'
  }
    
};

