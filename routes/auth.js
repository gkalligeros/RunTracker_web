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
var jwt = require('jwt-simple'),
moment = require('moment'),
crypto = require("crypto")
exports.settoken = function(req, res, next)
{
   /* console.log(req.body.username);
    console.log(req.body.password);

    console.log(req.query.password);
    console.log(req.body);
    console.log(req.parms);
*/
    if (!req.body.username || !req.body.password)
    {
        req.error = "nopass";
        return next();


    }

    req.collections.users.findOne(
    {
        username: req.body.username,
    }, function(error, user)
    {

      //  console.log("user is ", user);
        if (error)
        {
            // send database error
            return next(error);
        }
        if (user == null)
        {
            //todo send wrong conbination response 
            req.error = "No user ";

        }
        else
        {
            //check if password is corect 
        //    console.log("yours  ",crypto.createHmac('sha256', user.salt).update(req.body.password).digest('hex'));
       //     console.log("mine  ",user.psw);
            if(user.psw==crypto.createHmac('sha256', user.salt).update(req.body.password).digest('hex'))
            {
                console.log("authorized");
                var expires = moment().add(180,'minutes').valueOf();
                var token = jwt.encode(
                {

                    username: user.username,
                    exp: expires
                }, 'tsakatsoukou');
                req.token = token;
            }
            else
            {
                console.log("unauthorized");
                req.error = "Wrong password ";
            }
        }
        return next();

    })


};

exports.validateuser = function(req, res, next)
{

  //  console.log("validateuser");
    var token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-access-token']||(req.session.token);
        console.log("validateuser");

    if (!token) 
    {
        // no token 
    //    console.log("no token");
        req.error = "Unauthorized";
        return next();
    }
    else
    {
        //decode token 
        var decoded = jwt.decode(token, 'tsakatsoukou');
        console.log("decoded",decoded);
        console.log("encoded",token);

        //console.log( "console.log",decoded.iss);
        if (decoded.exp <= Date.now())
        {
            req.error = "expired";
         //   console.log("expired");
            return next();
        }
        else
        {
            req.collections.users.findOne(
            {
                username: decoded.username,

            }, function(error, user)
            {
                if (error)
                {
                    // send database error
                    return next(error);
                }
                if (user == null)
                {
                    //no user with such id (fake token)
               //     console.log("user is ", user);
                    req.error = "no_user";
               //     console.log("no_user");
                    return next();
                }
                else
                {
                  //  console.log("user is ", user);
                    //hide password
                    user.psw="";
                    req.user=user;
                    return next();
                    
                }

            })

        }
    }
}