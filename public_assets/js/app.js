$(function(){
    var jwt = '';
    var map;
    var mapProp;
    var markers = [];

    $('#login').click(function(){
        Authenticate($('#username').val(),$('#password').val());
    });

    $('#update').click(function(){
        var status = $('#status').val();
        navigator.geolocation.getCurrentPosition(function(position){
          Update(position.coords.latitude,position.coords.longitude,status);
        });
    });

    $('#getNearest').click(function(){
        getNearest();
    });

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
                $('#jwt').html(jwt);
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
    }

    function Update(x,y,status){
        var data = {
            lattitude : x,
            longitude : y,
            status: status
        };
        $('#lat').val(x);
        $('#long').val(y);
        initialize_maps(x,y)
        $.ajax({
            type:"POST",
            beforeSend: function (request)
            {
                request.setRequestHeader('x-access-token', jwt);
            },
            url: "/api/v1/users/position",
            data: $.param(data)
        });
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
                $.each(response.data[0],function(index,val){
                    output += '<li>' + val.name + ' ( ' + val.location[0] + ' , ' + val.location[1]+' ) ' + '</li>';
                    var myLatLng = {lat: val.location[0], lng: val.location[1]};
                    markers.push(new google.maps.Marker({
                       position: myLatLng,
                       map: map,
                       label: val.name,
                       title: 'Hello World!'
                   }));
                });

                $('#friends').html(output);
            }
        });
    }
});
