
var path = require('path')
  , express = require('express')
  , passport = require('passport')
  , RedisStore = require('connect-redis')(express)
  , env = require('./env')
  , appMiddleware = require('./middlewares/app');


var app = module.exports = express()
app.set('port', process.env.PORT || env.ports.app);
app.set('views', __dirname + '/../app/views');
app.set('view engine', 'hjs');
//app.use(express.favicon());
app.use(express.logger(env.logFormat))
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(env.cookie.secret));
app.use(express.session(env.session));
app.use(express.csrf());
app.use(passport.initialize());
app.use(passport.session());
app.use(appMiddleware);
app.use(app.router);
app.use(express.static(path.join(__dirname, '..', 'public')));

if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}
