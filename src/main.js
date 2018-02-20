
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.268025, lng: 108.947175},
        zoom: 12,
        disableDefaultUI: true
    });
    InitMark();
};

$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});

// 
var locations = [
    {
        name: "大唐芙蓉园",
        lat: 34.211048,
        lng: 108.9749846
    },
    {
        name: "大雁塔",
        lat: 34.2171601,
        lng: 108.9662626,
    },
    {
        name: "陕西历史博物馆",
        lat: 34.220508,
        lng: 108.9559011,
    },
    {
        
        name: "钟楼",
        lat: 34.2583144,
        lng: 108.9451903
    },
    {
        name: "碑林博物馆",
        lat: 34.2520922,
        lng: 108.9277647
    }
];

// Place Object.

var Place = function(place){
    "use strict";
    this.name = ko.observable(place.name);
    this.lat = ko.observable(place.lat);
    this.lng = ko.observable(place.lng);
    this.marker = ko.observable();
}

//WGPT20IAITWVBDG2DONI2WGWPLNUC3RXKVZYCH1QR1VWAA2C
//KTEQNP35BXFODIXAB4GY31MA5BWHOPAXB4IXR5WKX505DCMU


function placeInfo(place){
    const name = place.name();
    var contentInfo = `<div>${name}</div>`;
    return contentInfo;
}

function InitMark(){
    var LocationsViewMode = function() {
        var self = this;
        self.placeList = ko.observableArray([]);

        locations.forEach(function(p){
            self.placeList.push(new Place(p));
        });

         // Initialize the infowindow
        var infowindow = new google.maps.InfoWindow({
            maxWidth: 200
        });

        

        self.onSelect = function(place) {
            console.log('Your select:', place.name(), place.marker);
            google.maps.event.trigger(place.marker, 'click');
        };

        self.placeList().forEach(function(place){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(place.lat(), place.lng()),
                map: map,
                animation: google.maps.Animation.DROP
            });
            place.marker = marker;
            // add  click listener
            marker.addListener('click', function() {
                infowindow.setContent(placeInfo(place))
                infowindow.open(map, this);
                marker.setAnimation(google.maps.Animation.BOUNCE);
                map.setCenter(marker.getPosition());
                setTimeout(function () {
                    marker.setAnimation(null);
                }, 1000);
            });
        });
        // search input
        self.userInput = ko.observable('');

        self.filterPlaces = function() {
           var seachText = self.userInput().trim();
            
           self.placeList().forEach(function(place){
                place.marker.setVisible(place.name().indexOf(seachText) !== -1);
                place.marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function () {
                    place.marker.setAnimation(null);
                }, 1000);
           });
      
        };
    };

    ko.applyBindings(new LocationsViewMode());
};