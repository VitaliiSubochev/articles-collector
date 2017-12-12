/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

const DESKTOP_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36';


module.exports.custom = {

  /***************************************************************************
  *                                                                          *
  * Any other defaults for custom configuration used by your app.            *
  *                                                                          *
  ***************************************************************************/
  // mailgunDomain: 'transactional-mail.example.com',
  // mailgunApiKey: 'key-testkeyb183848139913858e8abd9a3',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  // …
	
	fb: {
		app: '955280417962731',		
		key: '6ae37f0be139e7fa8bd6e348bd1b3e58',
		token: 'EAANk0o35OusBAFLAiFtTLWKwnrv9ZA7tNZC7cMZAJwGkIVEzZCd9QgoC5zeEzTCnp2zWBWumiohxU2SZALbBXZAivL0jJgwtNgrrOU6naV7u80VRT2Ez7MMI6dWZB7UwKhmH8AtbYQXNUuzPGBSeYZA1fschbZBWfwWZATpVKkhOSuZAwZDZD',
		headers: {
			'User-Agent': DESKTOP_USER_AGENT
		},
		api: {
			version: '2.11',
		},
		timeout: 5000,
		wait: 10,
		attempts: 3
	},

	tw: {
		client: null,
		key: '7KsJEqEC7muNdhuTZqZvBsLQG',
		secret: 'vtRxrKZMbyNCIKOKJxc69XK2EljZl0FzdbgiutHnvokLefkNvt',
		token: null,
		headers: {
			'User-Agent': DESKTOP_USER_AGENT
		},
		api: {
			version: '1.1',
		},
		timeout: 5000,
		wait: 100,
		attempts: 3
	}

};
