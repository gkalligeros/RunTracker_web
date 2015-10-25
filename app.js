/*Copyright (C) 2014 Yiorgos Kalligeros
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH 
 THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/

var express = require('express'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    mongoskin = require('mongoskin'),
    dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/Run_tracker';
db = mongoskin.db(dbUrl,
    {
        safe: true
    }),
    collections = {
        tracks: db.collection('tracks'),
        users: db.collection('users')
    };

// Express.js Middleware
var session = require('express-session'),
    logger = require('morgan'),
    errorHandler = require('errorhandler'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');


var app = express();
app.locals.appTitle = 'Run Tracker';
app.set('jwtTokenSecret', 'tsakatsouka');

// Expose collections to request handlers
app.use(function(req, res, next)
{
    if (!collections.tracks || !collections.users) return next(new Error('No collections.'))
    req.collections = collections;
    return next();
});
// Express.js configurations
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// Express.js middleware configuration
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('3CCC4ACD-6ED1-4844-9217-82131BDCB239'));
app.use(session(
    {
        secret: '2C44774A-D649-4D44-9535-46E296EF984F'
    }))

if ('development' == app.get('env'))
{
    app.use(errorHandler());
}

// web authorized routes
app.get('/', routes.auth.validateuser, routes.index);
app.get('/profile', routes.auth.validateuser, routes.profile);
app.get('/stats', routes.auth.validateuser, routes.stats);

// web guest routes
app.get('/logout', routes.logout);
app.get('/login', routes.login);
app.get('/register', routes.register);

//app.post('/register',routes.webregister);
app.post('/login', routes.auth.settoken, routes.weblogin);
app.post('/mlogin',routes.auth.settoken,routes.mobilelogin);

//api routes  
app.get('/api/profile', routes.auth.validateuser, routes.api.get_profile); //get a profile
app.post('/api/profile', routes.api.new_profile); //new profile 
app.put('/api/profile', routes.auth.validateuser, routes.api.edit_profile); //edit profile
app.del('/api/profile', routes.auth.validateuser, routes.api.del_profile); //delete  profile

app.get('/api/profile/tracks', routes.auth.validateuser, routes.auth.validateuser, routes.api.get_tracks); //get a users tracks 
app.post('/api/profile/tracks', routes.auth.validateuser, routes.api.new_track); //new track 
app.del('/api/profile/tracks', routes.auth.validateuser, routes.api.del_track); //delete a track based on its id 
app.get('/api/profile/tracks_p/:page/:size',routes.api.get_paged_tracks);



app.all('*', function(req, res)
{
    res.send(404);
})



var server = http.createServer(app);
var boot = function()
{
    server.listen(app.get('port'), function()
    {
        console.info('Express server listening on port ' + app.get('port'));
    });
}
var shutdown = function()
{
    server.close();
}
if (require.main === module)
{
    boot();
}
else
{
    console.info('Running app as a module')
    exports.boot = boot;
    exports.shutdown = shutdown;
    exports.port = app.get('port');
}