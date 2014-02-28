var http = require('http')
var concat = require('concat-stream')
var auth = require('tent-auth')
var qs = require('querystring')
var util = require('util')
var debug = require('debug')('tent-login')

var checkInterval = 500

module.exports = function(entity, opts, cb) {
	if(!entity) throw new Error('entity required')
	if(!opts) throw new Error('opts.app and .proxy required')
	if(!opts.app) throw new Error('opts.app required')
	if(!opts.proxy) throw new Error('opts.proxy required')

	if(!opts.app.redirect_uri) {
		opts.app.redirect_uri = window.location.origin + '/blank'
	}

	var res = {} // meta, auth, appId
	var state = ''
	
	window.w = window.open()
	var interval

	debug('get meta post from discover proxy', url)

	var url = util.format(opts.proxy, entity)
	var req = http.get(url, onProxyResponse)

	function onProxyResponse(resp) {
		debug('got proxy response')

		var err = []
		if(resp.statusCode !== 200) {
			err.push(resp.statusCode)
		}

		resp.pipe(concat({ encoding: 'string' }, onMeta))
	
		function onMeta(body) {
			if(!body) {
				err.push('no body')
				return cb(new Error(err.join()))
			}

			var data = JSON.parse(body)
			
			if(data.error) {
				err.push(data.error)
				return cb(new Error(err.join()))
			}

			res.meta = data.post.content

			debug('got meta post', res.meta)

			auth.registerApp(res.meta, opts.app, onRegistration)
		}
	}

	function onRegistration(err, tempCredentials, appID) {
		if(err) return cb(err)

		var url = auth.generateURL(res.meta, appID)

		debug('got redirect url', url.url)

		res.auth = tempCredentials
		res.appId = appID
		state = url.state

		w.location = url.url

		debug('open popup and set interval')

		interval = setInterval(checkLocation, checkInterval)
	}

	function checkLocation() {
		if(!w.location) {
			clearInterval(interval)
			return cb(new Error('oauth dialog closed'))
		}

		if(w.location.hostname === window.location.hostname) {
			clearInterval(interval)

			var search = w.location.search.substr(1) // remove ? on beginning
			var query = qs.decode(search)

			var err = []

			if(query.state !== state) {
				err.push('mismatching state ('+state+' != '+query.state+')')
			}
			if(query.error) {
				err.push(query.error)
			}
			if(err.length > 0) {
				return cb(new Error(err.join()))
			}

			w.close()

			auth.tradeCode(res.meta, res.auth, query.code, onToken)
		}
	}

	function onToken(err, credentials) {
		if(err) return cb(err)
		
		res.auth = credentials

		cb(null, res)
	}
}