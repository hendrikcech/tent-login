var express = require('express')
var fs = require('fs')
var browserify = require('browserify')
var DiscoverProxy = require('tent-discover-proxy')

var app = express()

app.use('/discover', new DiscoverProxy())

app.get('/', function(req, res) {
	fs.createReadStream(__dirname + '/index.html').pipe(res)
})
app.get('/bundle.js', function(req, res) {
	res.setHeader('content-type', 'text/javascript')
	browserify(__dirname+'/script.js').bundle({insertGlobals: true}).pipe(res)
})

var server = app.listen(8200)
console.log('server listening on :%d', server.address().port)