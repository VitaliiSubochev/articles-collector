/**
 * Article.js
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
    // время создания сообщения в vk, fb, tw
    created_time: {
      type: Sequelize.DATE,
      allowNull: true
    },
    // заголовок сообщения
    title: {
      type: Sequelize.STRING,
      allowNull: true
    },
    // текст сообщения
    text: {
      type: Sequelize.TEXT,
      // allowNull: false,
      // validate: {
      //   notNull: true,
      //   notEmpty: true,
      //   len: [15, 1024]
      // }    
    },
    // как часто ключевое слово встречается в тексте сообщения
    keyword_count: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    // общее количество коментариев
    comments_count: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    // общее количество лайков
    likes_count: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    // откуда получено сообщение (тип источника)
    src_type: {
      type: Sequelize.ENUM,
      values: ['vk', 'tw', 'fb'],
      allowNull: false
    }

  },

  associations: function () {
    
  },

  options: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      freezeTableName: false,
      tableName: 'messages',     
  }

};

