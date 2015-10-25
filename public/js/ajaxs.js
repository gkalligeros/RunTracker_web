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


$(document).ready(function()
{
    //registration form submit POST 
    $("#register_form").submit(submit_register_form)
   

    //upadate profile form submit PUT 

    $("#update_form").submit(submit_edit_profile_form)

})
function submit_edit_profile_form(event)
{
    event.preventDefault();
    //new passwordfields are empty 
    if(!($("#pass_r").val())&&!($("#pass_rr").val()))
    {
        pass=$("#pass").val();
        $("#pass_rr").val(pass);
        $("#pass_r").val(pass);
    }

    if(!($("#pass").val())||!($("#pass_r").val())||!($("#name").val())||!($("#surname").val())||(!($("#username").val()))||!($("#pass_rr").val()))
    {
        $(".alert-warning").html("Please fill all data");
        $(".alert-warning").removeClass("hidden");
    }
    else if ($("#pass_rr").val()!=$("#pass_r").val())
    {
        $(".alert-warning").html("Passwords do not match");
        $(".alert-warning").removeClass("hidden");
    }
    else
    {
        $(".alert-warning").addClass("hidden");
        $.ajax(
        {
             url: '/api/profile',
            data:
            {
                username:$("#username").val(),
                password:$("#pass").val(),
                password_r:$("#pass_r").val(),
                name:$("#name").val(),
                surname:$("#surname").val()

            },
            type: 'PUT',
            success: function(data, status, xhr)
            {
                if(data.error)
                {
                    $(".alert-warning").html(data.error);
                    $(".alert-warning").removeClass("hidden");
                }
                else
                {
                    $(".alert-success").html("Profile changed!");
                    $(".alert-success").removeClass("hidden");

                }
               
            }
            })
        }
    }
function submit_register_form(event)
{
    event.preventDefault();
    if(!($("#pass").val())||!($("#pass_r").val())||!($("#name").val())||!($("#surname").val())||(!($("#username").val())))
    {
        $(".alert-warning").html("Please fill all data");
        $(".alert-warning").removeClass("hidden");
    }
    else if($("#pass").val()!=$("#pass_r").val())
    {
        $(".alert-warning").html("Passwords do not match");
        $(".alert-warning").removeClass("hidden");
            
    }
    else
    {
        $(".alert-warning").addClass("hidden");
        $.ajax(
        {
             url: '/api/profile',
            data:
            {
                username:$("#username").val(),
                password:$("#pass").val(),
                name:$("#name").val(),
                surname:$("#surname").val()

            },
            type: 'POST',
            success: function(data, status, xhr)
            {
                if(data.error)
                {
                    $(".alert-warning").html(data.error);
                    $(".alert-warning").removeClass("hidden");
                }
                else
                {
                    $(".alert-success").html("Profile created use your username an password to <a href='/login'>login!</a>");
                    $(".alert-success").removeClass("hidden");

                }
               
            }
            })
        }
    }