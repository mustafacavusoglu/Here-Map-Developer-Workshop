var platform = new H.service.Platform({
  apikey: "r5bUWI3FIRyp8Pp-WzM_qDsRDThxNOGkwfQaxqLjwrc",
});

// Obtain the default map types from the platform object:

var defaultLayers = platform.createDefaultLayers();

// Get your current position from wego.here.com

var myPosition = { lat: 41.02676, lng: 28.89069 };

// Instantiate (and display) a map object:

var map = new H.Map(
  document.getElementById("mapContainer"),
  defaultLayers.vector.normal.map,
  {
    zoom: 12,
    center: myPosition,
  }
);

var ui = H.ui.UI.createDefault(map, defaultLayers, "tr-TR");

var mapEvents = new H.mapevents.MapEvents(map);

var behavior = new H.mapevents.Behavior(mapEvents);

// Get an instance of the routing service for using the routing API

var router = platform.getRoutingService();

// Get an instance of the geocoding and search service:

var service = platform.getSearchService(); // create an icon for the marker.

var homeIcon = new H.map.Icon("img/home.png");

var posMarker = new H.map.Marker(myPosition, { icon: homeIcon });

// Add the marker to the map

map.addObject(posMarker);

function showDeliveryRest() {
  let param = {
    at: myPosition.lat + "," + myPosition.lng,
    categories: "100-1000-0003", // category Take Out and Delivery Only ,
    // for more, got to https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics-places/places-category-system-full.html
    limit: 40,
  };

  service.browse(param, displayRestaurants, alert);
  /*   service.browse(param, setRestaurants, alert);
   */
}

var param = {
  at: myPosition.lat + "," + myPosition.lng,
  categories: "100-1000-0003", // category Take Out and Delivery Only ,
  // for more, got to https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics-places/places-category-system-full.html
  limit: 40,
};

var names = [
  { key: "Haskız Baharat", value: "0" },
  { key: "Anteplioğlu Baklava Tatlı", value: "1" },
  { key: "İstanbul Catering", value: "2" },
  { key: "Santra Birahanesi", value: "3" },
  { key: "Gözde Anteplioğu", value: "4" },
  { key: "Ankara Kuuyemiş", value: "5" },
  { key: "Nar Cafe & Mutfak", value: "6" },
  { key: "Hafifol Diyet Yemek Servisi", value: "7" },
  { key: "Aydoğan Kuruyemiş", value: "8" },
  { key: "Hacıalioğlu Çiğ Köfte", value: "9" },
  { key: "Bereket 3 Odun Ekmek Fırını", value: "10" },
  { key: "Cremeria Mılano", value: "11" },
  { key: "Marmaris Büfe", value: "12" },
  { key: "Gaziosmanpaş Aşevi", value: "13" },
  { key: "Bolçi", value: "14" },
  { key: "Beyoğlu Kuruyemiş", value: "15" },
  { key: "Çiğköfte Evi", value: "16" },
  { key: "Şekerci Ali Muhiddin Hacı Bekir", value: "17" },
  { key: "Tarihi Beyoğlu Çikolatacısı", value: "18" },
  { key: "Midiyeci Gökhan", value: "19" },
  { key: "Alı Haydar Kebap", value: "20" },
  { key: "Aktar Gurme Service", value: "21" },
  { key: "Gimaş Ship Supply & Services", value: "22" },
  { key: "Saray Sandwich", value: "23" },
  { key: "Kutu Mutfak", value: "24" },
  { key: "Wrap Star", value: "25" },
  { key: "Yemeksepetı", value: "26" },
  { key: "Aristo Sandwich & Salad Bar", value: "27" },
  { key: "Koko Moko", value: "28" },
  { key: "Granola Healthy &Tasty", value: "29" },
  { key: "Wienerwald", value: "30" },
  { key: "Arizona Burger", value: "31" },
  { key: "Pidehan", value: "32" },
  { key: "Lila Catering", value: "33" },
  { key: "Roksi - Diyet Yemek Servisi", value: "34" },
  { key: "Mert Karadeniz Balıkçılık", value: "35" },
  { key: "Duru Balık", value: "36" },
  { key: "Güzeller Catering", value: "37" },
  { key: "Hanımeli Börekçisi", value: "38" },
  { key: "Çiğköfteci Ömer Usta", value: "39" },
];
var i = document.getElementById("language");
for (index in names) {
  i.options[i.options.length] = new Option(names[index].key, index);
}

function setValue(){

  var ind = document.getElementById("language").selectedIndex;

  window.location.reload(false);

  ind.value = ind.value;
 }

function displayRestaurants(response) {
  var takeOutIcon = new H.map.Icon("img/takeout.png");

  var restGroup = new H.map.Group();

  var ind = document.getElementById("language").selectedIndex;
  let restPosition = response.items[ind].position;

  let data = response.items[ind].title;

  let restMarker = new H.map.Marker(restPosition, { icon: takeOutIcon });

  restGroup.addObject(restMarker);
  map.addObject(restGroup);

  let deliveryRestPosition = response.items[ind].position;
  showRoute(deliveryRestPosition);

  const isMapAnimated = true;

  map.setCenter(restPosition, isMapAnimated);
/*   map.setZoom(13, isMapAnimated);
 */}


 
function showRoute(restPos) {
  // console.log(restPos);
  let routingParameters = {
    // The routing mode:
    mode: "fastest;car;traffic:enabled",
    // The start point of the route:
    waypoint0: restPos.lat + "," + restPos.lng,
    // The end point of the route:
    waypoint1: myPosition.lat + "," + myPosition.lng,
    // To retrieve the shape of the route we choose the route
    // representation mode 'display'
    representation: "display",

    routeattributes: "summary,shape",

    language: "tr-TR",
  };
  // bu fonksiyon ile tekrardan yol çizdir ***
  router.calculateRoute(routingParameters, onResult, function (error) {
    alert(error.message);
  });
}

var onResult = function (result) {
  var route, routeShape, startPoint, endPoint, linestring;
  if (result.response.route) {
    // Pick the first route from the response:
    let route = result.response.route[0];
    // Pick the route's shape:
    routeShape = route.shape;

    // Create a linestring to use as a point source for the route line
    linestring = new H.geo.LineString();

    // Push all the points in the shape into the linestring:
    routeShape.forEach(function (point) {
      var parts = point.split(",");
      linestring.pushLatLngAlt(parts[0], parts[1]);
    });

    // Create a polyline to display the route:
    var routeLine = new H.map.Polyline(linestring, {
      style: { strokeColor: "RGB(116, 66, 200)", lineWidth: 7 },
    });
    // Add the route polyline and the two markers to the map:
    map.addObject(routeLine);

    let maneuver = route.leg[0].maneuver;
    let summary = route.summary;
    displayInstructions(maneuver, summary);

    // Set the map's viewport to make the whole route visible:
    map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
  }

  Number.prototype.toMMSS = function () {
    return Math.floor(this / 60) + " minutes " + (this % 60) + " seconds.";
  };

  function displayInstructions(maneuver, summary) {
    var totalTravelTime = 0;

    for (let i = 0; i < maneuver.length; i++) {
      instructions = maneuver[i].instruction;
      // console.log(instructions)
      document.getElementById("panel").innerHTML +=
        i + 1 + ") " + instructions + `<br>`;
    }

    document.getElementById("panel").innerHTML +=
      "Total distance : " + summary.distance + " m";

    document.getElementById("panel").innerHTML +=
      "Estimated time : " + summary.travelTime.toMMSS();
  }
};
