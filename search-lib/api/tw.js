const { Agent } = require('https');
const { URL, URLSearchParams } = require('url');

const fetch = require('node-fetch');

const CollectStream = require('../collect');
const { getNestedField, checkNested } = require('../util/helpers');


class TW {
  
  constructor(api, config) {
    this.api = api;
    this.config = config;
    this.config.agent = new Agent({ keepAlive: true, keepAliveMsecs: this.config.timeout });
  }

}

module.exports = TW;