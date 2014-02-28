var login = require('../')
require('debug').enable('*')

var form = document.getElementById('form')
form.addEventListener('submit', onSubmit)

function onSubmit(e) {
	e.preventDefault()

	var entity = document.getElementById('entity').value

	var opts = {
		app: { 
			name: 'tent-request newTests App',
			url: 'http://testtestappapp.com',
			// redirect_uri: 'http://localhost:8080/callback',
			types: {
				read: [ 'http://cech.im/types/song/v0#' ],
				// write: [ '' ]
			},
			// scopes: ['permissions']
		},
		proxy: '/discover?entity=%s'
	}

	console.log('login', entity)

	login(entity, opts, function(err, creds) {
		if(err) console.error(err)
		else console.log(JSON.stringify(creds))
	})
}