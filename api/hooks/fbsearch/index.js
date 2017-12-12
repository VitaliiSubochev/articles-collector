const { URL } = require('url');

const API = require('../../../search-lib');
const { getNestedField, checkNested, quickSort } = require('../../../search-lib/util/helpers');

const api = new API(sails);

const GROUPS_LIMIT_PER_PAGE   = 100;  // лимит найденных групп на одну страницу
const GROUPS_MAX_PAGES        = 5;    // количество страниц для поиска групп
const GROUPS_FOR_FETCH_FEED   = 10;   // количество групп, с наибольшим числом участников для выборки постов.

const BATСH_REQ_MAX_SIZE      = 50;   // пакетный запрос может содержать максимум 50 элементов.



module.exports = function defineFbSearchHook(sails) {

  return {

    initialize: function (next) {
      sails.log.debug('Initializing custom hook (`fbsearch`)');
      return next();

    },

    run: async function (query) {
      let groups = [];
      let membersCount = [];
      let feeds = [];
      let commentsCount = [];
      let likesCount = [];

      sails.log.debug('Starting search in Facebook Graph API with query: ' + query);

      try {
        sails.log.debug('Fething opened groups...');
        groups = await getOpenedGroups({ q: query, limit: GROUP_LIMIT_PER_PAGE, pages: GROUP_MAX_PAGES });
        sails.log.debug('Founded ' + groups.length + ' groups.');

        sails.log.debug('Searching count of members in groups.');
        membersCount = await getMembersCount(groups);

        sails.log.debug('Fething feeds of posts in 10 most popular founded groups.');
        feeds = await getFeeds(membersCount.slice(0, GROUPS_FOR_FETCH_FEED));


        // for(let item of members) {
        //   sails.log.debug(item.count);
        // }

        // sails.log.info(members.length);

        // sails.log.info('sorted:');
        // let res = quickSort(members, 'count');
        // sails.log.info(res);
        // for (let group of groups) {
        //   posts = posts.concat(await getGroupPostsAndAuthors(group.id, { q: query, limit: 50, pages: 2 }));
        // }

        // for (let post of posts) {
        //   commentsCount = commentsCount.concat(await getPostCommentsCount(post.id));
        //   likesCount = likesCount.concat(await getPostLikesCount(post.id));
        // }

        // let res = getMostRelevantPosts(5);
        // console.log(res);

      } catch (error) {
        sails.log.error(error.message);
      }
    }

  };

};

function getOpenedGroups(params) {
  let collect = [];

  return new Promise((resolve, reject) => {
    params.type = 'group';
    params.endpoint = 'search';

    api.fb.collect(params)
      .on('error', reject)
      .on('end', () => resolve(collect))
      .on('data', group => {
        let opened = group.filter(value => value.privacy === 'OPEN' ? true : false);
        collect = collect.concat(opened);
    });
  });
}

function getMembersCount(groups) {
  let collect = [];

  return new Promise((resolve, reject) => {
    let ids = groups
      .map(group => group.id)
      .reduce((prev, curr, idx, self) => {
        if (!(idx % BATСH_REQ_MAX_SIZE)) {
          prev.push(self.slice(idx, idx + BATСH_REQ_MAX_SIZE)); // batch request should not consist greater than of 50 elements!
        }
        return prev;
      }, []);

    for (let items of ids) {
      let params = { endpoint: '', batch: [] };

      for (let id of items) {
        params.batch.push({ 
          'method': 'GET', 
          'relative_url': `${id}?fields=members.limit(0).summary(true)`
        });
      }

      api.fb.collect(params)
        .on('error', reject)
        .on('end', () => resolve(quickSort(collect, 'count')))
        .on('data', data => {
          for (let item of data) {
            collect.push({ id: item.id, count: item.members.summary.total_count })
          }     
        });   
    } 
  });
}

function getFeeds(groups) {
  let collect = [];
  
  return new Promise((resolve, reject) => {
    let ids = groups.map(group => group.id);
    let params = { endpoint: '', batch: [] };

    for (let id of ids) {
      params.batch.push({ 
        'method': 'GET', 
        'relative_url': `${id}?fields=feed.limit(10){message,id,from,permalink_url,name,description,updated_time,comments.limit(0).summary(true),likes.limit(0).summary(true)}`
      });
    }

    api.fb.collect(params)
      .on('error', reject)
      .on('end', () => resolve(collect))
      .on('data', data => {
        // for (let item of data) {
        //   collect.push({ id: item.id, count: item.members.summary.total_count })
        // }
        console.log("msg");     
      });     
  });
}

async function getGroupPostsAndAuthors(groupId, params) {
  let collect = [];
  const { q, ...restParams } = params;

  return Promise.resolve(new Promise((resolve, reject) => {

    restParams.endpoint = groupId + '/feed';
    restParams.fields = 'message,id,from';

    let stream = api.fb.collect(restParams);

    stream.on('error', reject);

    stream.on('data', posts => {
      sails.log.info('analizing posts...');

      let filtered = posts.map((post) => {
        post.keywords = [];
        return post;
      })
      .filter((post) => {
        if (post.message) {
          if (post.message.length > 150) {
            return true;
            // post.keywords = post.message.match(new RegExp(q, 'gi'));

            // if (post.keywords === null) {
            //   return false;
            // } else if (post.keywords.length >= 1) {
            //   return true;
            // }
          }
        }
        return false;
      });

      collect = collect.concat(filtered);

      for (let post of filtered) {

        sequelize.models.Message.create({
          src_id: post.id,
          text: post.message,
          //keyword_count: post.keywords.length,
          src_type: 'fb'
        })
        .then(() => {
          sequelize.models.Author.findOne({
            // logging: console.log,
            // logger: console.log,
            where: {
              'src_id': post.from.id
            }
          })
          .then((author) => {
            console.log(author);
            if (author) {
              return;
            } else {
              sequelize.models.Author.create({
                'src_id': id,
                'name': post.from.name,
                'src_type': 'fb'
              })
              // {
              //   logging: console.log,
              //   logger: console.log,
              // }
            //)
            .catch(err => sails.log.error(err.message));

            }

          })
          .catch(err => sails.log.error(err.message));

        })
        .catch((err) => sails.log.error(err.message));
      }

    });

    stream.on('end', () => resolve(collect));
  }));
}

async function getPostCommentsCount(postId) {
  let collect = [];
  let params = {};

  return Promise.resolve(new Promise((resolve, reject) => {

    params.endpoint = postId + '/comments';
    params.limit = 0;
    params.summary = true;

    let stream = api.fb.collect(params);

    stream.on('error', reject);

    stream.on('data', summary => {

      sequelize.models.Message.findOne({ where: { 'src_id': { [Sequelize.Op.like]: postId.toString() }}})
      .then((msg) => {
        if (msg) {
          msg.update({
            'comments_count': summary.total_count
          })
          .catch(err => sails.log.error);
        } else {
          sails.log.warn('Message ' + postId + ' not found in database.');
        }
      })
      .catch(err => sails.log.error);

      collect = collect.concat(summary);
    });

    stream.on('end', () => resolve(collect));
  }));
}

async function getPostLikesCount(postId) {
  let collect = [];
  let params = {};
  let weight;

  return Promise.resolve(new Promise((resolve, reject) => {

    params.endpoint = postId + '/likes';
    params.limit = 0;
    params.summary = true;

    let stream = api.fb.collect(params);

    stream.on('error', reject);

    stream.on('data', summary => {

      sequelize.models.Message.findOne({ where: { 'src_id': { [Sequelize.Op.like]: postId.toString() }}})
      .then((msg) => {
        if (msg) {
          weight = msg.comments_count * 0.3 + summary.total_count * 0.7;
          msg.update({
            'likes_count': summary.total_count,
            'weight': weight
          })
          .catch(err => sails.log.error);
        } else {
          sails.log.warn('Message ' + postId + ' not found in database.');
        }
      })
      .catch(err => sails.log.error);

      collect = collect.concat(summary);

    });

    stream.on('end', () => resolve(collect));
  }));
}

async function getMostRelevantPosts(count) {
  let result;

  sequelize.models.Message.findAndCountAll({ order: 'weight' })
  .then((res) => {
    result = res;
    return result;
  })
  .catch(err => sails.log.error);
}


// async function getMostRelevantPosts() {
//   let post = {
//     id: null,
//     weight: null
//   }

//   let results = [];

//   return new Promise((resolve, reject) => {
//     sequelize.models.Message.findAll()
//     .then((posts) => {
//       for (let post of posts) {
//         results.push({
//           id: post.id,
//           text: post.text,
//           weight: (post.keyword_count * 0.2 + post.comments_count * 0.3 + post.likes_count * 0.5)
//         });
//       }
//       return results;
//     });
//   });
// }

