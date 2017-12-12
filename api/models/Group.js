/**
 * Group.js
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
    // название группы
    title: {
      type: Sequelize.STRING,
      allowNull: true
    },
    // количество участников в группе
    members_count: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    // откуда получена группа (тип источника)
    src_type: {
      type: Sequelize.ENUM,
      values: ['vk', 'fb'],
      allowNull: false
    },
    // ключевые слов, по которым была найдена группа
    keywords: {
  
    }
  },

  associations: function () {    
  },

  options: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    freezeTableName: false,
    tableName: 'groups',     
},

};

