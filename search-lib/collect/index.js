const { Readable } = require('stream');
const { URL, URLSearchParams } = require('url');

const Request = require('../api/request');
const { getNestedField, checkNested } = require('../util/helpers');


class CollectStream extends Readable {
  
  constructor(fb, params) {
    super({ objectMode: true });

    this.fb = fb;

    const { endpoint, pages, ...other } = params;

    this.endpoint = endpoint;
    this.limit = params.limit;
    this.pages = pages;
    this.received = 0;
    this.attempts = 0;
    this.promise = null;
    this.params = { ...other };
  }

  then(thenFn, catchFn) {
    if (this.promise === null) {
      let collect = [];

      this.promise = new Promise((resolve, reject) => {
        this
          .on('error', reject)
          .on('end', () => resolve(collect))
          .on('data', (items) => {
            collect.push(items);           
          });
      });
    }
    return Promise.resolve(this.promise).then(thenFn, catchFn);
  }

  async _read() {
    let req, res, parsed, data, paging, summary;

    req = new Request(this.endpoint, { ...this.params });

    try {
      res = await this.fb.api.callWithRequest(req);
    } catch(err) {
      const { attempts } = this.fb.config.attempts;

      if (this.attempts >= attempts) {
        this.emit('error', err);
        return;
      }
      this.attempts++;     
      this._read();
      return;
    }

    try {
      parsed = await res.json();
    } catch(err) {
      this.emit('error', err); 
      return;
    }

    data = getNestedField(parsed, 'data');
    paging = getNestedField(parsed, 'paging');
    summary = getNestedField(parsed, 'summary');

    if (data) {      
      if (data.length === 0) {
        if (summary) {
          if (this.limit === 0 && this.received > this.limit) {
            this.push(null);
            return;
          } else {
            this.received += 1;
            this.push(summary);
            return;
          }
        } else {
          this.push(null);
          return;
        }
      }

      this.received += data.length;
      
      if (this.received < this.limit * this.pages) {
  
        if (paging && checkNested(paging, 'next')) {
          let url = new URL(paging.next);

          url.searchParams.forEach((val, name) => {
            Object.defineProperty(this.params, name, {
              value: val,
              writable: true,
              enumerable: true,
              configurable: true              
            });
          });

        } else {
          this.push(null);
          return;
        }
      } else {
        this.push(null);
        return;
      }
    } else {
      if (parsed instanceof Array && parsed.length !== 0) {
        let result = [];

        for (let item of parsed) {
          if (item.body) {
            try {
              result.push(JSON.parse(item.body));
            } catch(err) {
              this.emit('error', err);
              return;
            }
          }
        }
        this.received += result.length;

        if (this.received > this.params.batch.length) {
          this.push(null);
          return;          
        } else {
          this.push(result);
          return;
        }
      } else {
        this.push(null);
        return;
      }
    }
    this.push(data);
  }

}

module.exports = CollectStream;