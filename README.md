# tent-login
Utility to make Tent logins super easy for web apps. By opening a popup, the login page won't be left and you can handle success and error events simply by waiting for a callback.  
To circumvent CORS restrictions this library relies on a server that proxies the discover request. You could use [tent-discover-proxy](https://github.com/hendrikcech/tent-discover-proxy) for this.  
You can either use [browserify](https://github.com/substack/node-browserify) or download a standalone build [here](https://github.com/hendrikcech/tent-login/releases/latest) to load this module into the browser.  
Take a look at the example for further inspiration.

## install
With npm:

	npm install tent-login --save

Or download the latest build [here](https://github.com/hendrikcech/tent-login/releases/latest).

## usage
```javascript
var login = require('tent-login')

// suppose this is called when the login form is submitted
function onSubmit(e) {
	
	e.preventDefault()

	var entity = document.getElementById('entity').value

	var opts = {

		// schema details [here](https://tent.io/docs/post-types#meta)
		app: { 
			name: 'Test App',
			url: 'http://tent.example.com',
			types: {
				read: [ 'all' ],
				write: [ 'all' ]
			}
		},

		// formated using nodes' `util.format` function. `%s` replaced by the entity to discover
		proxy: 'http://discoverproxy.example.com?entity=%s'
	}

	login(entity, opts, function(err, user) {
		if(err) console.error(err)

		// `user` is an object containing `auth`, `meta` and `appId` keys
		else console.log(user)
	})
}
```

## license
MIT