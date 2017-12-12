// const util = require('util');
// const Twitter = require('twitter');
// var supeagent = require('superagent');


/**
 * ArticleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  search: async function(req, res) {
    sails.log.debug("[MessageController.search]");
    
    res.redirect('/');
    await sails.hooks.fbsearch.run(req.param('search'));
    sails.log.info('Search in Facebook Graph API is finished');  
  }
}
