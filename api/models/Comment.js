/**
 * Comment.js
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
    // время создания комментария в vk, fb, tw
    created_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    // текст сообщения
    text: {
      type: Sequelize.TEXT,
      allowNull: false    
    }

  },

  options: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    freezeTableName: false,
    tableName: 'comments',   
  }

};

