/**
 * Request.js
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
    // состояние поискового запроса: выполняется, отклонен, завершен. 
    condition: {
      type: Sequelize.ENUM,
      values: ['executed', 'rejected', 'completed'],
      allowNull: false
    },
    // список ключевых слов запроса
    query: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },

};

