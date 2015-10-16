$(function(){
    var jwt = '';

    $('#login').click(function(){
        Authenticate($('#username').val(),$('#password').val());
    });

    $('#updatePosition').click(function(){
        UpdatePosition($('#lat').val(),$('#long').val());
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

    function UpdatePosition(x,y){
        var data = {
            lattitude : x,
            longitude : y
        };
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
                });
                $('#friends').html(output);
            }
        });
    }
});
