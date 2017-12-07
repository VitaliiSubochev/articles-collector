
module.exports = function defineSequelizeHook(sails) {
  
  global['Sequelize'] = require('sequelize');
  Sequelize.useCLS(require('continuation-local-storage').createNamespace('sails-sequelize-mysql'));

  return {

    initialize: function (next) {
      let hook = this;

      sails.log.debug('Initializing custom hook (`sequelize`)');

      hook.initAdapters();
      hook.initModels();

      var datastore, migrate, sequelize;
      sails.log.verbose('Using datastore named ' + sails.config.models.datastore);
      datastore = sails.config.datastores[sails.config.models.datastore];

      if (datastore === null) {
        throw new Error('Datastore \'' + sails.config.models.datastore + '\' not found in config/datastores.js');
      }

      if (datastore.options === null) {
        datastore.options = {};
      }
      datastore.options.logging = sails.log.verbose; // A function that gets executed everytime Sequelize would log something.

      migrate = sails.config.models.migrate;
      sails.log.verbose('Migration: ' + migrate);

      sequelize = new Sequelize(datastore.database, datastore.user, datastore.password, datastore.options);
      global['sequelize'] = sequelize;

      return sails.modules.loadModels(function (err, models) {
        let modelDef, modelName, ref;

        if (err) {
          return next(err);
        }

        for (modelName in models) {
          modelDef = models[modelName];
          sails.log.verbose('Loading model \'' + modelDef.globalId + '\'');
          global[modelDef.globalId] = sequelize.define(modelDef.globalId, modelDef.attributes, modelDef.options);
          sails.models[modelDef.globalId.toLowerCase()] = global[modelDef.globalId];
        }

        for (modelName in models) {
          modelDef = models[modelName];

          hook.setAssociation(modelDef);
          hook.setDefaultScope(modelDef);
        }

        if (migrate === 'safe') {
          return next();
        } else {
          var forceSync = migrate === 'drop';
          sequelize.sync({force: forceSync}).then(function () {
            return next();
          });
        }
      });

    },

    initAdapters: function () {
      if (sails.adapters === undefined) {
          sails.adapters = {};
      }
    },

    initModels: function () {
      if (sails.models === undefined) {
          sails.models = {};
      }
    },

    setAssociation: function (modelDef) {
      if (modelDef.associations !== null) {
          sails.log.verbose('Loading associations for \'' + modelDef.globalId + '\'');
          if (typeof modelDef.associations === 'function') {
              modelDef.associations(modelDef);
          }
      }
    },

    setDefaultScope: function (modelDef) {
      if (modelDef.defaultScope !== null) {
          sails.log.verbose('Loading default scope for \'' + modelDef.globalId + '\'');
          var model = global[modelDef.globalId];
          if (typeof modelDef.defaultScope === 'function') {
              model.$scope = modelDef.defaultScope() || {};
          }
      }
    }

  };

};
