
class Request {

  constructor(endpoint, params = {}) {
    this.endpoint = endpoint;
    this.params = params;

    this.attemps = 0;

    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  addAttempt() {
    this.attemps++;
  }
}

module.exports = Request;