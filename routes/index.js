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
exports.auth = require('./auth');
exports.api = require('./api');

exports.index = function(req, res, next)
{

 
    if (req.user)
    {

        req.collections.tracks.find(
        {
            username: req.user.username
        }).toArray(
            function(error, tracks)
            {
                if (error)
                {
                    // send database error
                    return next(error);
                }
                else
                {
                  //  console.log("tracks are ", tracks);
                    res.render('runs',
                    {
                        logged: true,
                        runs: tracks
                    });
                }

            })
    }
    else if (req.error=="expired")
    {

        res.render('login',
        {
            error:req.error,
            logged: false
        });
    }
    else
    {
           res.render('login',
        {
            logged: false
        });
    }
};
exports.profile = function(req, res, next)
{

    if (req.user)
    {
        res.render('profile',
        {
            logged: true,
            user:req.user
        });
    }
    else if(req.error=="expired")
    {
        res.render('login',
        {
            error:req.error,
            logged: false
        });
    }
    else
    {
       res.render('login',
        {
            logged: false
        });        
    }
};
exports.stats = function(req, res, next)
{

    if (req.user)
    {
        res.render('stats',
        {
            logged: true
        });
    }
    else if(req.error=="expired")
    {
        res.render('login',
        {
            error:req.error,
            logged: false
        });
    }
};
exports.register = function(req, res, next)
{

    res.render('register',
    {
        logged: false
    });

};
//check credentials an return a jwt 
exports.login = function(req, res, next)
{

    res.render('login',
    {
        logged: false
    });

};

exports.logout = function(req, res, next)
{
    req.session.token = null;
    res.redirect('/');

};
//login endpoint for web 
exports.weblogin = function(req, res, next)
{
  //  console.log("token is  ", req.token);

    if (req.error)
    {
        //wrong pass
        return res.render('login',
        {
            error: req.error
        });
    }
    else
    {
        req.session.token = req.token;
        res.redirect('/');

    }

};
//login endpoint for mobile 
exports.mobilelogin = function(req, res, next)
{
    //console.log("token is  ", req.token);

    if (req.error)
    {
        //wrong pass
        res.json(
        {
            error: req.error
        });
    }
    else
    {
        
        res.json(
        {
            token: req.token
        });
    }

};