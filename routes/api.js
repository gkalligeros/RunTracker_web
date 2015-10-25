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
moment = require('moment');
uuid = require('node-uuid');
crypto = require("crypto");

exports.get_profile = function(req, res, next)
{
    if (req.user)
    {
        res.json(req.user);
    }
    else if (req.error)
    {
        res.json(
        {
            error: req.error
        });
    }
    else
    {

        res.json(
        {
            error: "something is fucked up"
        });
    }
};
exports.new_profile = function(req, res, next)
{
  /*  console.log("-----------");
    console.log(req.body.username);
    console.log(req.body.password);
    console.log(req.body.name);
    console.log(req.body.surname);
    console.log("-----------");*/
    console.log(req.body.email);

    if ((!req.body.email)(!req.body.username) || (!req.body.password) || (!req.body.name) || (!req.body.surname))
    {
        res.json(
        {
            error: "Fill all data"
        })
    }
    else
    {

        req.collections.users.findOne(
        {
            username: req.body.username,
        }, function(error, user)
        {
            console.log("user is ", user);
            if (error)
            {
                // send database error
                return next(error);
            }
            if (user == null)
            {
                var salt = uuid.v1();//salt for encryption 
                var pass_enc = crypto.createHmac('sha256', salt).update(req.body.password).digest('hex');//encrypted pass
                req.collections.users.insert(
                {
                    "username": req.body.username,
                    "name": req.body.name,
                    "surname": req.body.surname,
                    "psw": pass_enc,
                    "salt":salt
                }, function(error, userresponse)
                {
                    if (error) return next(error);
                    res.json({ok:"registration completed"});
                });

            }
            else
            {
                res.json(
                {
                    error: "username taken"
                });
            }

        })


    };

};
//
exports.edit_profile = function(req, res, next)
{
    console.log("error:",req.error);
    if(req.error)
    {
         res.json(
        {
            error: req.error
        });
    }
   else if (req.user.username != req.body.username)
    {
        res.json(
        {
            error: "Not authorized"
        });
    }
    else
    {
        req.collections.users.findOne(
        {
            username: req.body.username,
        }, function(error, user)
        {
           // console.log("user is ", user);
            if (error)
            {
                // send database error
                return next(error);
            }
            else if (user == null)
            {
                res.json(
                {
                    error: "Wrong password "
                });
            }

            else if(crypto.createHmac('sha256', user.salt).update(req.body.password).digest('hex')==user.psw)
            {
                //console.log(req.body.name);
                pass_enc=crypto.createHmac('sha256', user.salt).update(req.body.password_r).digest('hex');
                req.collections.users.update(
                    {
                        username: req.body.username
                    },
                    {
                        username:req.body.username,
                        name: req.body.name,
                        surname: req.body.surname,
                        psw: pass_enc,
                        salt:user.salt
                    },
                    {
                        strict: true
                    },
                    function(error, result)
                    {
                       // console.log(result);
                        if (error)
                        {
                            next(error)
                        }
                        else
                        {
                            res.json(
                            {
                                succes: "Profile changed!"
                            });
                        }

                    })

            }
            else
            {
             res.json(
                {
                    error: "Wrong password "
                });
            }                    
            

        })

    }

};

exports.del_profile = function(req, res, next)
{
    res.json(
    {
        error: "not implemented"
    });
};


//track api 

exports.get_tracks = function(req, res, next)
{
    if (req.error)
    {
        res.json(
        {
            error: req.error
        });
    }
    else
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
                   // console.log("tracks are ", tracks);
                    res.json(tracks);
                }

            })
    }
    // res.json({error:"not implemented"});
};

//not used at the moment (dynamic server pagination)
exports.get_paged_tracks = function(req, res, next)
{
    var size = req.params.size;
    var page = req.params.page;
    skip = page > 0 ? ((page - 1) * size) : 0;
  //  console.log(size, page); 
    req.collections.tracks.find(
    {
       username:req.user.username
    }, null,
    {         
        skip: skip,
        limit: size      
    }, function(err, data)
    {         
        if (err)
        {            
            res.json(500, err);         
        }         
        else
        {            
            res.json(
            {               
                data: data            
            });         
        }      
    });
    next();
}
exports.new_track = function(req, res, next)
{
   // console.log(req.body);
    if (req.error)
    {
        //not authorized 
        res.json(
        {
            error: req.error
        });
    }
    else
    {
        if ((req.user.username) && (req.body.date) && (req.body.distance) && (req.body.time) && (req.body.track))
        {
            req.collections.tracks.insert(
            {
                "username": req.user.username,
                "date": req.body.date,
                "distance": req.body.distance,
                "time": req.body.time,
                "track": req.body.track
            }, function(error, userresponse)
            {
                if (error) return next(error);
                res.json({"ok":"ok"});
            });
        }
        else
        {
            res.json(
            {
                error: "something missing"
            });
        }

    }
};
exports.del_track = function(req, res, next)
{
  //  console.log( req.body);
    if (req.error)
    {
        res.json(
        {
            error: req.error
        });
    }

    else
    {
        my_id= (req.body && req.body.id) || (req.query && req.query.id) || req.headers['id'];
        req.collections.tracks.findById(
            my_id,
            function(error, track)
            {
                if (error)
                {
                    // send database error
                    return next(error);
                }
                if (track == null)
                {
                    //no track with such id 
                    res.json(
                    {
                        error: "no such track"
                    });
                }
                else
                {
                   // console.log("track is ", track);

                    if (req.user.username === track.username)
                    {
                        req.collections.tracks.removeById(my_id, function(error, count)
                        {
                            if (error) return next(error);
                            res.json(
                            {
                                affectedCount: count
                            });
                        });

                    }
                    else
                    {
                        res.json(
                        {
                            error: "not authorized to delete"
                        });
                    }

                }

            })

    }
};