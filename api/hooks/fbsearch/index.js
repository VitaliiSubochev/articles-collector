const API = require('../../../search-lib');
const api = new API(sails);


module.exports = function defineFbSearchHook(sails) {

  return {

    initialize: function (next) {
      sails.log.debug('Initializing custom hook (`fbsearch`)');   
      return next();

    },

    run: async function (query) {
      sails.log.debug('Starting search in Facebook Graph API with query: ' + query);

      try {        
        let groups = await getOpenedGroups({ q: query, limit: 5, pages: 3 });

        for (let group of groups) {
          let feed = await getGroupPosts(group.id, { q: query, limit: 100, pages: 3 });
        }

      } catch(error) {
        sails.log.error(error);
      }
    }

  };

};

async function getOpenedGroups(params) {
  let collect = [];

  return Promise.resolve(new Promise((resolve, reject) => {

    params.type = 'group';
    params.endpoint = 'search';

    let stream = api.fb.collect(params);
    
    stream.on('error', reject);   

    stream.on('data', group => {

      let opened = group.filter((value) => {
        if (value.privacy === "OPEN") return true;
        else return false;
      });
      collect = collect.concat(opened);   
    });

    stream.on('end', () => resolve(collect)); 
  }));
}

async function getGroupPosts(groupId, params) {
  let collect = [];
  const { q, ...restParams } = params;
  
  return Promise.resolve(new Promise((resolve, reject) => {

    restParams.endpoint = groupId + '/feed';
    //restParams.fields = 'message,id,from';

    let stream = api.fb.collect(restParams);
    
    stream.on('error', reject);   

    stream.on('data', posts => {

      let filtered = posts.map((post) => {
        post.keywords = [];
        return post;
      })
      .filter((post) => {
        if (post.message) {
          if (post.message.length > 100) {
            sails.log.info('analizing message, id: ' + post.id);     
            post.keywords = post.message.match(new RegExp(q, 'gi'));
            
            if (post.keywords === null) {
              return false;
            } else if (post.keywords.length >= 1) {
              return true;
            } 
          }
        }
        return false;
      });

      collect = collect.concat(posts);

      for (let post of filtered) {
        sequelize.models.Message.create({
          src_id: post.id,
          text: post.message,
          keyword_count: post.keywords.length,
          src_type: 'fb'
        })
        .catch((err) => {
          sails.log.error(err.message);
        });
      }

    });

    stream.on('end', () => resolve(collect)); 
  }));
}
