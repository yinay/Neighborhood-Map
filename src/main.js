
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.268025, lng: 108.947175},
        zoom: 12,
        disableDefaultUI: true
    });
    locations.forEach(function(location){
        new google.maps.Marker({
            position: new google.maps.LatLng(location.lat, location.lng),
            map: map,
            animation: google.maps.Animation.DROP
        });
    });
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
}

!function(){
    var LocationsViewMode = function() {
        var self = this;
        self.placeList = ko.observableArray([]);

        locations.forEach(function(p){
            self.placeList.push(new Place(p));
        });

        self.onSelect = function(address) {
            console.log('Your select:', address);
        };

        // self.placeList().forEach(function(place){
        //     new google.maps.Marker({
        //         position: new google.maps.LatLng(place.lat(), place.lng()),
        //         map: map,
        //         animation: google.maps.Animation.DROP
        //     });
        // });
    };

    ko.applyBindings(new LocationsViewMode());
} ();