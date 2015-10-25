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


var map; //global var map 
var path ; //global for polyline 
//init map 
function initialize()
{
    var mapOptions = {
        zoom: 5,
        center: new google.maps.LatLng(24.886, -70.268),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    map = new google.maps.Map(document.getElementById('map_container'), mapOptions);
}
$(document).ready(function()
{
    //registration form submit POST 
 


    $("button.remove").click(remove_track);
    //active track on hover 
    $(".trackelement").hover(
        function()
        {
            $(this).addClass("active");

        },
        function()
        {
            $(this).removeClass("active");
        }
    );
    //pagination 
    $("div.holder").jPages(
    {
        containerID: "list",
        perPage: 4,

    });

    $(".trackdiv").click(function()
    {

        track_code = placetrack(($(this).attr("track")));

    });
    map_css_hack();

})


        


//simple height  hack because i dont know css :P
function map_css_hack()
{   
    console.log( parseInt(($(".list").css("height"))));
    if(parseInt(($(".list").css("height")))<400)
    {
         $("#map_container").css("height", "500");
    }
    else
    {
        $("#map_container").css("height", ($(".list").css("height")));

    }
}
//place the track in the map 
function placetrack(track_code)
{
   
    track = google.maps.geometry.encoding.decodePath(track_code);
    if(path!=undefined)
    {
        path.setMap(null);
    }
     path = new google.maps.Polyline(
    {
        path: track,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    //zoom map so that the whole polyline can be viewed 
    var bounds = new google.maps.LatLngBounds();
    track.forEach(function(latLng)
    {
        bounds.extend(latLng);
    });
    map.fitBounds(bounds);

    path.setMap(map);

  
}



var remove_track = function(event)
{
    if (confirm('Are you sure?'))
    {
        $li = findLi(event);
            //ajax req
        $.ajax(
        {
             url: '/api/profile/tracks',
            data:
            {
                id: $li.attr("track_id")
            },
            type: 'DELETE',
            success: function(data, status, xhr)
            {
               $li.remove(); //remove element 
            }
            })
        }
}
    //find parent li element so we can remove it 
var findLi = function(event)
{
    var target = event.srcElement || event.target;
    var $target = $(target);
    var $li = $target.parents('li');
    return $li;
};
google.maps.event.addDomListener(window, 'load', initialize);