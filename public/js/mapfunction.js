var map;
var pos;
var markers = [];
var previous = [];
var infoWins = [];

function initialize() {
    var mapOptions = {
        scaleControl: true,
        streetViewControl: false,
        zoom: 12
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // Try HTML5 geolocation
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // $.post("https://homelesshelp.herokuapp.com/location", position.coords.latitude, position.coords.longitude, function(resp) {
            //     window.alert(resp);
            // });


            $.post("https://homelesshelp.herokuapp.com/location", position.coords.longitude, function(resp) {
                for(var i = 0; i < resp.length; i++) {

                    // $.get("http://maps.google.com/maps/api/geocode/json?address=" + resp[i].address_street + ', ' + resp[i].address_city, function(res) {
                    //     var data = {};
                    //     console.log(res);
                    //     data = res.results[0].geometry.location;
                    //     addMarker(res);
                    // });
                    addMarker(resp[i]);
                    if(i == 0) {
                        $(".carousel-inner").append('<div class="item active"><a onclick="toggleBounce('+i+'); showWindow('+i+')">'+ (i+1)+'. '+resp[i].title+'<br>'+resp[i].address_street+'<br>'+resp[i].phone+'<br>'+ 'Capacity: '+resp[i].capacity+'</a></div>');
                        // $(".carousel-inner").append('<div class="item active">'+ (i+1)+'. '+resp[i].title+'<br>'+resp[i].address_street+'<br>'+resp[i].phone+'<br>'+ 'Capacity: '+resp[i].capacity+'</div></a>');
                    }

                    else {
                        $(".carousel-inner").append('<div class="item"><a onclick="toggleBounce('+i+'); showWindow('+i+')">'+ (i+1)+'. '+resp[i].title+'<br>'+resp[i].address_street+'<br>'+resp[i].phone+'<br>'+ 'Capacity: '+resp[i].capacity+'</a></div>');
                    }
                }

            });

            // markers[0].setIcon(highlightedIcon());

            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            // var marker = new google.maps.Marker({
            //     position: pos,
            //     map: map
            // });
            // markers.push(marker);

            map.setCenter(pos);
        },function () {
            handleNoGeolocation(true);
        });
    }
    else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
}

function contentFormat(body){
    var type = "Type: "+body.type+"<br/>";
    var building = "Building: "+body.building+"<br/>";
    var room = "Room #: "+body.room+"<br/>";
    var code = "Code: "+body.code+"<br/>";
    var people = "# of people: "+body.people+"<br/>";

    return type+building+room+code+people;
}

function showWindow(index) {
    // markers[index].click();
    console.log(index);

    // GEvent.trigger(markers[1], 'click');
    google.maps.event.trigger(markers[index], 'click');

    if(previous.length != 0) {
        previous[0].close();
    }

    previous[0] = infoWins[index];
}

 function toggleBounce (ind) {
        if (markers[ind].getAnimation() != null) {
            markers[ind].setAnimation(null);
        } else {
            markers[ind].setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function ()
            {
                markers[ind].setAnimation(null);
            }, 1400);
        }
    }


function addMarker(data) {
    $.get("http://maps.google.com/maps/api/geocode/json?address=" + data.address_street + ', ' + data.address_city, function(res) {
        var temp = res.results[0].geometry.location;
        var location = new google.maps.LatLng(temp.lat, temp.lng);

        var marker = new google.maps.Marker({
            position: location,
            map: map
        });

    // marker.addListener('click', toggleBounce);

    markers.push(marker);
    // map.panTo(location);

    var infowindow = new google.maps.InfoWindow({
        content: '<img class="thumbnail" src="'+ data.Image + '">'
        // position: location,
        // content: contentFormat(temp)
    });

    infoWins.push(infowindow);

     marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

    // infowindow.open(map, marker);

    });
    // var temp = data.results[0].geometry.location;
    // var location = new google.maps.LatLng(temp.lat, temp.lng);

    // var marker = new google.maps.Marker({
    //     position: location,
    //     map: map
    // });

    // // marker.addListener('click', toggleBounce);

    // markers.push(marker);
    // // map.panTo(location);

    // var infowindow = new google.maps.InfoWindow({
    //     content: '<div>ass</div>'
    //     // position: location,
    //     // content: contentFormat(temp)
    // });
    // infowindow.open(map, marker);
}

function highlightedIcon() {
      return {
        url: 'http://steeplemedia.com/images/markers/markerGreen.png'
      };
}

// Sets the map on all markers in the array.
function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function serverLookup(event){
    //var url = "http://localhost:8080/lookup";
    var url = "http://uwstudygroup.herokuapp.com/lookup";

    event.preventDefault();
    var code = document.getElementById("code").value;

    var formData = {};
    formData.code = code;

    jQuery.ajax({
        type:"POST",
        url:url,
        data:JSON.stringify(formData),
        dataType:"json",
        contentType: "application/json"
    }).done(
        function(data){
            console.log(data);
            clearMarkers();
            for(var i = 0; i < data.length; i++){
                addMarker(data[i]);
            }
        }
    ).fail(
        function(data){
            console.log('err');
            console.log(JSON.stringify(data));
            console.log(data.status);
            console.log(data.statusMessage);
        }
    );
}

function serverCreate(event){
    //var url = "http://localhost:8080/create";
    var url = "http://uwstudygroup.herokuapp.com/create";

    event.preventDefault();
    var code = document.getElementById("code").value;
    var building = document.getElementById("building").value;
    var room = document.getElementById("room").value;
    var people = document.getElementById("people").value;

    var formData = {};
    formData.code = code;
    formData.building = building;
    formData.room = room;
    formData.people = people;

    jQuery.ajax({
        type:"POST",
        url:url,
        data:JSON.stringify(formData),
        dataType:"json",
        contentType: "application/json"
    }).done(
        function(data){
            console.log(data);
        }
    ).fail(
        function(data){
            console.log('err');
            console.log(JSON.stringify(data));
            console.log(data.status);
            console.log(data.statusMessage);
        }
    );
}

function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', initialize);