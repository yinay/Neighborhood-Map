
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.268025, lng: 108.947175},
        zoom: 12,
        disableDefaultUI: true
    });
    InitMark();
};

var locations = [
    {
        name: "大唐芙蓉园",
        lat: 34.211048,
        lng: 108.9749846,
        venueId: "4c16193f77cea593c414d360",
    },
    {
        name: "大雁塔",
        lat: 34.2171601,
        lng: 108.9662626,
        venueId: "4baee72df964a520b7e03be3",
    },
    {
        name: "陕西历史博物馆",
        lat: 34.220508,
        lng: 108.9559011,
        venueId: "4deefb944765f83613cdba6e"
    },
    {
        
        name: "钟楼",
        lat: 34.2583144,
        lng: 108.9451903,
        venueId: "4bf58dd8d48988d1fa931735"
    },
    {
        name: "碑林博物馆",
        lat: 34.2520922,
        lng: 108.9277647,
        venueId: "4e9a448a2c5b4d64054e233c"
    }
];

// Place Object.

var Place = function(place){
    "use strict";
    this.id = ko.observable(place.venueId)
    this.name = ko.observable(place.name);
    this.lat = ko.observable(place.lat);
    this.lng = ko.observable(place.lng);
    this.marker = ko.observable();
}

function placeInfo(place, infowindow, target){
    const name = place.name();
    const id = place.id();
    var contentInfo = `<div><h6>${name}</h6>`;
    const url = `https://api.foursquare.com/v2/venues/${id}?client_id=WGPT20IAITWVBDG2DONI2WGWPLNUC3RXKVZYCH1QR1VWAA2C&client_secret=KTEQNP35BXFODIXAB4GY31MA5BWHOPAXB4IXR5WKX505DCMU&v=20180220`;
    $.ajax({
        url: url,
        dataType: "json",
        success: function(data) {
            var result = data.response.venue;
            var photoPrefix, photoSuffix ;
            var bestPhoto = result.hasOwnProperty('bestPhoto') ? result.bestPhoto : '';
            if (bestPhoto.hasOwnProperty('prefix')) {
                photoPrefix = bestPhoto.prefix || '';
            }

            if (bestPhoto.hasOwnProperty('suffix')) {
                photoSuffix = bestPhoto.suffix || '';
            }
 
            contentInfo += `<div id="pic"><img src="${photoPrefix}100x100${photoSuffix}"></div>`;
            contentInfo += '</div>';
            infowindow.setContent(contentInfo); 
            infowindow.open(map, target);

        },
        error: function(e) {
            contentInfo += '<p>Foursquare 出错啦！暂未找到合适的图片.</p>'
            contentInfo += '</div>';
            infowindow.setContent(contentInfo); 
            infowindow.open(map, target);
        }
    });
}

function InitMark(){
    var LocationsViewMode = function() {
        var self = this;

        // on toggler

        self.togglerAcitve = ko.observable(false);

        // Toggler Btn handler
        self.onTogglerBtn = function() {
            self.togglerAcitve(!self.togglerAcitve());

        };

        self.placeList = ko.observableArray([]);

        locations.forEach(function(p){
            self.placeList.push(new Place(p));
        });
        
        // Initialize the infowindow
        var infowindow = new google.maps.InfoWindow({
            maxWidth: 200
        });

        self.onSelect = function(place) {
            google.maps.event.trigger(place.marker, 'click');
        };

        self.placeList().forEach(function(place){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(place.lat(), place.lng()),
                map: map,
                animation: google.maps.Animation.DROP
            });
            place.marker = marker;
            // add  click listener on marker.
            marker.addListener('click', function() {
                placeInfo(place, infowindow ,this);
                marker.setAnimation(google.maps.Animation.BOUNCE);
                map.setCenter(marker.getPosition());
                setTimeout(function () {
                    marker.setAnimation(null);
                }, 1000);
            });
        });
        // search input
        self.userInput = ko.observable('');
        self.showPlaceList = ko.observableArray([]);
        // push all place to show.
        self.showPlaceList.push(...self.placeList());
        // input filter 
        self.filterPlaces = function() {
           var seachText = self.userInput().trim();
           self.showPlaceList.removeAll(); 
           self.placeList().forEach(function(place){
                place.marker.setVisible(false);
               if( place.name().indexOf(seachText) !== -1){
                    place.marker.setVisible(true);
                    self.showPlaceList.push(place);
                    place.marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function () {
                        place.marker.setAnimation(null);
                    }, 1000);
               }
           });
        };
    };

    ko.applyBindings(new LocationsViewMode());
};