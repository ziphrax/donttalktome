$(function(){
    var jwt = '';
    var map;
    var mapProp;
    var markers = [];
    var infoWindow = new google.maps.InfoWindow();
    var updaterTimeout = '';
    var mapReady = false;

    checkAuth();

    $('#login').click(function(){
        Authenticate($('#username').val(),$('#password').val());
    });

    $('#dismiss').click(function(){
        localStorage.setItem("readnotice",true);
    });

    $('#update').click(function(){
        navigator.geolocation.getCurrentPosition(function(position){
          initialize_maps(position.coords.latitude,position.coords.longitude);
        });
        updater();
    });

    $('#fit').click(function(){
        fit();
    });

    function checkNotice(){
        if(!localStorage.readnotice){
            $('#alert').show();
        }
    }

    function updater(){
        var status = $('#status').val();
        navigator.geolocation.getCurrentPosition(function(position){
          Update(position.coords.latitude,position.coords.longitude,status);
        });
        updaterTimeout = setTimeout(updater,3000);
    }

    $('#logout').click(function(){
        logout();
        $('#logout').hide();
    });

    function logout(){
        jwt = '';
        localStorage.removeItem("username");
        localStorage.removeItem("jwt");
        updaterTimeout = false;
        $('#login-form').show();
        $('#logout').hide();
        $('#status-form').hide();
        $('#google-map').hide();
        $('#friends-list').hide();
        map = null;
        markers = [];
        infoWindow = [];
        mapReady = false;
    }

    function checkAuth(){
        var tempJWT = localStorage.jwt;
        if(tempJWT){
            jwt = tempJWT;
            $('#login-form').hide();
            $('#logout').show();
            $('#status-form').show();
            $('#google-map').show();
            $('#friends-list').show();
        } else {
            $('#login-form').show();
        }
    }

    function Authenticate(username,password){
        var data = {
            name : username,
            password : password
        };
        $.ajax({
            type:"POST",
            beforeSend: function (request)
            {
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            },
            url: "/api/v1/authentication",
            data: $.param(data),
            success: function(response) {
                jwt = response.token;
                localStorage.setItem("username",username);
                localStorage.setItem("jwt",jwt);
                $('#jwt').html(jwt);
                checkAuth();
            }
        });
    }

    function initialize_maps(x,y) {
      mapProp = {
        center:new google.maps.LatLng(x,y),
        zoom:5,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
      mapReady = true;
      $('#fit').show();
    }



    function Update(x,y,status){
        var data = {
            lattitude : x,
            longitude : y,
            status: status
        };

        if(mapReady){
            map.panTo(new google.maps.LatLng(x,y));
        }
        $.ajax({
            type:"POST",
            beforeSend: function (request)
            {
                request.setRequestHeader('x-access-token', jwt);
            },
            url: "/api/v1/users/position",
            data: $.param(data),success:function(){
                getNearest();
            }
        });
    }

    function createInfoWindow(marker, popupContent) {
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.setContent(popupContent);
            infoWindow.open(map, this);
        });
    }

    function fit(){
        var latlngbounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
          latlngbounds.extend(markers[i].position);
        }
        map.fitBounds(latlngbounds);
    }

    function getNearest(){
        $.ajax({
            type:"GET",
            beforeSend: function (request)
            {
                request.setRequestHeader('x-access-token', jwt);
            },
            url: "/api/v1/friends/nearest",
            success: function(response) {
                var output = '';
                markers = [];
                $.each(response.data[0],function(index,val){
                    output += '<li class="list-group-item">' + val.name + ' ( ' + val.location[0] + ' , ' + val.location[1]+' ) ' + '</li>';
                    var myLatLng = {lat: val.location[0], lng: val.location[1]};
                    var contentString = val.name + ':' + val.status;

                    infoWindow = new google.maps.InfoWindow({
                        content: contentString
                    });
                    var marker = new google.maps.Marker({
                       position: myLatLng,
                       map: map,
                       title: 'Hello World!'
                   });

                   createInfoWindow(marker, contentString);

                    markers.push(marker);
                });

                $('#friends').html(output);
            }
        });
    }
});
