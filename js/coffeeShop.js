var app = angular.module("app",['ui.bootstrap','google-maps', 'ui.map', 'ui.event','ui.directives'])
var globalIndex;

var RatingDemoCtrl = function ($scope) {
    $scope.rate = 0;
    $scope.max = 10;
    $scope.isReadonly = false;


    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };
};

var coffeeShops = [
    {name:'StarBucks',address:'3401 Walnut St Philadelphia', picturesUrl:['http://placekitten.com/90/200','http://placekitten.com/150/200'],logoUrl: "../assets/img/goldStandard_logo2.jpg",visited:false},
    {name:'Saxbys', address:'4000 Locust St Philadelphia 19104',picturesUrl:['http://placekitten.com/100/200'],logoUrl: "../assets/img/goldStandard_logo2.jpg",visited:false},
    {name:'Gold Standard',
        address:'4800 Baltimore Ave Philadelphia 19143',
        picturesUrl:['../assets/img/goldStandard/goldStandard_1.jpg','../assets/img/goldStandard/goldStandard_2.jpg','../assets/img/goldStandard/goldStandard_3.jpg'],
        logoUrl: "../assets/img/goldStandard_logo2.jpg",
        visited:true},
    {name:'Manakeesh Cafe Bakery',address:'4420 Walnut St Philadelphia PA 19104', picturesUrl:['http://placekitten.com/190/200','http://placekitten.com/160/200'],logoUrl: "../assets/img/goldStandard_logo2.jpg", visited:true}
];

app.controller( "CoffeeShopCtrl" ,function($scope,$http){
    $scope.coffeeShops =coffeeShops;



    $scope.addCoffeeShop = function(){
        coffeeShops.push({name:$scope.coffeeShopName})
    }

});

var ModalDemoCtrl = function ($scope, $modal, $log) {

    $scope.items =coffeeShops;

    $scope.open = function () {

        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
};

function CarouselCtrl($scope){
    $scope.myInterval =5000;
    var slides = $scope.slides=[]; //= $scope.shop.picturesUrl;
    var localIndex = globalIndex;
    $scope.localIndex = localIndex;

    $scope.shop =coffeeShops[$scope.localIndex]
  //  window.alert($scope.shop.name) ;

    for(var i=0; i<$scope.shop.picturesUrl.length;i++){
        slides.push({image:$scope.shop.picturesUrl[i], text:"asa"});
    }
}

var CarouselModalCtrl = function ($scope, $modal, $log) {

    $scope.items =coffeeShops;
    $scope.currentShop;

    $scope.open = function (index) {

        globalIndex = index;
        //window.alert($scope.items[index].name) ;
        $scope.currentShop = $scope.items[index].name;
        var modalInstance = $modal.open({
            templateUrl: 'carouselContent.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
};

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

function mapsController ($scope){
    $scope.center= {
        latitude: 0, // initial map center latitude
        longitude: 0 // initial map center longitude
    };
    $scope.markers= []; // an array of markers,
    $scope.zoom= 1; // the zoom level
}

var geocoder;
function MapCtrl($scope) {
    $scope.coffeeShops =coffeeShops;
    var ll = new google.maps.LatLng(39.950263, -75.214022);
    $scope.mapOptions = {
        center: ll,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //Markers should be added after map is loaded
    $scope.onMapIdle = function() {
        if ($scope.myMarkers === undefined){
            var marker = new google.maps.Marker({
                map: $scope.myMap,
                position: ll
            });
            $scope.myMarkers = [marker ];

            //loop through the coffee shop database and add all addresses to the map
            for(var i=0; i<coffeeShops.length;i++){
                converter($scope,coffeeShops[i].address);
            }

        }
    };

    $scope.markerClicked = function(m) {
        window.alert("clicked");
    };
}

function converter($scope,streetAddress){

    var latlng;
    GMaps.geocode({
        address: streetAddress,
        callback: function(results, status) {
            if (status == 'OK') {
                latlng = results[0].geometry.location;
                var lat = latlng.lat().toString();
                var lng = latlng.lng().toString();
                var ll2 = new google.maps.LatLng(lat, lng);
                $scope.myMarkers.push(new google.maps.Marker({map:$scope.myMap, position:ll2}))
            }
        }
    });
}

