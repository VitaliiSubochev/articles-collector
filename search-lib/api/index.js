const FB = require('./fb');
const TW = require('./tw');
const Request = require('../api/request');


class API {

  constructor(sails) {
    this.fb = new FB(this, sails.config.custom.fb);
    this.tw = new TW(this, sails.config.custom.tw);

    this.queue = [];
    this.started = false;
    this.suspended = false;
  }

  callWithRequest(request) {
    this.queue.push(request);
    this.worker();
    return request.promise;
  }

  enqueue(endpoint, params) {
    const req = new Request(endpoint, params);
    return this.callWithRequest(req);
  }

  requeue(request) {
    this.queue.unshift();
    this.worker();
  }

  sequential(next) {
    this.fb.handleRequest(this.queue.shift());
    next();
  }

  worker() {
    if (this.started) {
      return;
    }

    this.started = true

    const work = async () => {
      if (this.queue.length === 0 || this.suspended) {
        this.started = false;
        return;
      }
      this.sequential(() => {
        setTimeout(work, this.fb.config.wait);        
      });
    };
    work();
  }

}

module.exports = API;


