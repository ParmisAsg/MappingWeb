// The tile layer 
console.log("working");

var apiKey = "pk.eyJ1IjoibG9ja2UzNiIsImEiOiJjam9sbnY2OHowNTd1M3FzOHVsc2duN2R4In0.ilnfrvun0Zc7NzXISIQZ2A";

var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: apiKey
});

// The map object 
var map = L.map("mapid", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});

// Adding graymap tile layer
graymap.addTo(map);

// Retrieving earthquake geoJSON data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Color determination based on earth quick magnitude
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#00e6ee";
    case magnitude > 4:
      return "#0093af";
    case magnitude > 3:
      return "#8100ee";
    case magnitude > 2:
      return "#ee00a5";
    case magnitude > 1:
      return "#db5a6b";
    default:
      return "#ee1800";
    }
  }

  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  L.geoJson(data, {
    
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    
    style: styleInfo,
    
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(map);

  // color object
  var legend = L.control({
    position: "bottomright"
  });

  // details
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#00e6ee",
      "#0093af",
      "#8100ee",
      "#ee00a5",
      "#db5a6b",
      "#ee1800"
    ];

    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(map);
});
