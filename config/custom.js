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
		app: '525146231179001',		
		key: 'f1255330d28c46e5c61be054580b9fd9',
		token: 'EAAHdniKQhvkBABhEvlr9CECZC77XBOuhFVV3KOG6178d8bUd6bUsmP3uYI1CfPUEvEdX5XsYUZBTN61ctiXa6wRLyRK8OZAUFKQIZAiSAYqnbWAJW2JLwoETgklA1m7w1yVoUqjYs8LZCWv1eJuL2CdE9NqTQbcmWfr45F2gEkgZDZD',
		headers: {
			'User-Agent': DESKTOP_USER_AGENT
		},
		api: {
			version: '2.11',
		},
		timeout: 5000,
		wait: 100,
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
