
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
//var MongoStore = require('connect-mongodb');
//var settings = require('./settings');
var SessionStore = require("session-mongoose")(express);
var store = new SessionStore({
    url : "mongodb://localhost/microblog",
    interval : 120000
});
var app = express();

/*app.configure(function(){
    app.set('views',__dirname+'/views');
    app.set('view engine','ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret:settings.cookieSecret,
        store: new MongoStore({
            db: settings.db
        })
    }));
    app.use(app.router);
    app.use(express.static(__dirname+'/public'));
});*/

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({secret:'microblogbyvoid'}));
app.use(express.session({
    secret : 'microblogbyvoid',
    store : store,
    cookie : {maxAge : 900000}
}))
app.use(function(req,res,next){
    res.locals.user = req.session.user;
    res.locals.err = req.session.error;
    res.locals.success = req.session.messages;
    var user = req.session.user;
    var err = req.session.error;
    var success = req.session.messages;
    delete req.session.error;
    delete req.session.messages;
    next();
})
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/reg',routes.reg);
app.post('/reg',routes.doReg);
app.get('/login',routes.login);
app.post('/login',routes.doLogin);
app.get('/logout',routes.logout);
app.get('/u/:user',routes.user);
app.post('/post',routes.post);
app.get('/mypost',routes.mypost);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
