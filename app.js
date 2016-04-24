var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');

var port = process.env.PORT||3000;
var dbURL = 'mongodb://localhost/imusic';
var app = express();

mongoose.connect(dbURL);

app.set('views','./app/views/pages');
app.set('view engine','jade');

app.use(require('body-parser').urlencoded({extended: true})); //把 post 和 get 请求传至后台，转化成一个对象
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
	secret: 'imusic',
	store: new mongoStore({
		url: dbURL,
		collection: 'sessions'
	})
}));

app.locals.moment = require('moment');
app.listen(port);
console.log('my website started on port'+port);

if('development' === app.get('env')){
	app.set('showStackError', true);
	app.use(logger(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug', true);
}

require('./config/routes')(app);