
// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// d3 leaflet function to fetch the data
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  console.log(data);
  createFeatures(data.features);
});

// Function to determine marker color by depth
function chooseColor(depth){
    if (depth < 10) return "#00FF00";
    else if (depth < 30) return "greenyellow";
    else if (depth < 50) return "yellow";
    else if (depth < 70) return "orange";
    else if (depth < 90) return "purple";
    else return "gray";
  }
  
  function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  
  let earthquakes = L.geoJSON(earthquakeData,{
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius:feature.properties.mag*5,
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.75
           });
    },
        onEachFeature: onEachFeature
});
  // Send earthquakes layer to the createMap function/
  createMap(earthquakes);
}

  function createMap(earthquakes) {

    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street,
     };

  // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
    };

// Create the map
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control. Pass it our baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}