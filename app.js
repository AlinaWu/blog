
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
//app.use(express.favicon());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());//Cookie parsing middleware
app.use(express.bodyParser({keepExtensions:true,uploadDir:'./public/images'}));
//app.use(favicon(__dirname + '/public/favicon.ico'));
//session cache
app.use(express.session({
  secret:settings.cookieSecret,
  key:settings.db,
  cookie:{maxAge:1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    //db:settings.db
    url:'mongodb://localhost/'+settings.db,
    autoRemove:'native'
  })
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port')+".");
});

routes(app);