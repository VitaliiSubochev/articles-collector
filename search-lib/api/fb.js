const { Agent } = require('https');
const { URL, URLSearchParams } = require('url');

const fetch = require('node-fetch');

const CollectStream = require('../collect');
const { getNestedField, checkNested } = require('../util/helpers');


class FB {
  
  constructor(api, config) {
    this.api = api;
    this.config = config;
    this.config.agent = new Agent({ keepAlive: true, keepAliveMsecs: this.config.timeout });
  }
  
  collect(params) {
    return new CollectStream(this, params);
  }

  async handleRequest(request) {
    const {
      token, agent, headers, timeout
    } = this.config;

    let { endpoint } = request;

    try {

      if (!/^v\d+\.\d+\//.test(endpoint)) {
        endpoint = `v${this.config.api.version}/${endpoint}`;
      }

      let url = new URL(`https://graph.facebook.com/${endpoint}`);
      
      if (checkNested(request.params, 'access_token')) {
        url.search = new URLSearchParams(request.params);
      } else {
        url.search = new URLSearchParams({ access_token: token, ...request.params });
      }

      const options = {
        method: 'GET',
        timeout: timeout,
        compress: false,
        headers: { 
          ...headers,
          connection: 'keep-alive'
        },
        agent: agent
      };

      //debug(`http --> ${endpoint}`);
      
      const startTime = Date.now();

      let response = await fetch(url.toString(), options);

      const endTime = (Date.now() - startTime).toLocaleString();

      //debug(`http <-- ${endpoint} ${endTime} msec.`);

      if ('error' in response) {
        request.reject(response.error);
        return;
      }

      request.resolve(response);      

    } catch(err) {
      const { wait, attempts } = this.config;
      
      if (request.addAttempt() <= attempts) {
        setTimeout(() => {
          debug(`Request ${endpoint} restarted ${request.attempts} times.`);
          this.api.requeue(request);
        }, wait);

        return;
      }
          
      request.reject(err);
    }
    
  }

}
  
  module.exports = FB;