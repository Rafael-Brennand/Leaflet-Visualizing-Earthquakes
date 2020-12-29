

function createMap(seismic_activity) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the earthquake layer
    var overlayMaps = {
      "Seismic Activity": seismic_activity
    };
  
    // Create the map object with options
    var map = L.map("map-id", {
      center: [0,0],
      zoom: 2,
      layers: [lightmap, seismic_activity]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
}



function createMarkers(response) {
  
    // Pull the seismic activities out of response.features
    var activities = response.features;
  
    // Initialize an array to hold the locations
    var locations = [];
  
    // Loop through the earthquakes
    for (var index = 0; index < activities.length; index++) {
      var earthquake = activities[index];
      var location = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];
      var color = "";
      var radius = "";
      if (earthquake.properties.mag > 5) {
        color = "red";
        radius = earthquake.properties.mag * 50000;
         }
        else if (earthquake.properties.mag > 3) {
            color = "orange";
            radius = earthquake.properties.mag * 35000;
         }
        else if (earthquake.properties.mag > 1) {
            color = "yellow";
            radius = earthquake.properties.mag * 20000;
        }
        

  
      // For each station, create a circle and bind a popup with the earthquake's magnitude and location
      var quakeMarker = L.circle(location, {
        fillOpacity: 0.75,
        color: "red",
        fillColor: color,
        // Adjust radius
        radius: radius
      })
        .bindPopup("<h3>Magnitude " + earthquake.properties.mag + "<h3><h3>Location: " + earthquake.properties.place + "</h3>");
  
      // Add the circle to the quakeMarkers array
      locations.push(quakeMarker);
    }
  
    
    // Create a layer group made from the quake markers array, pass it into the createMap function
    createMap(L.layerGroup(locations));
  }
  
  
  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);