function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}

function radiusF(feature) {
    size = feature.properties.mag ** 2

    return size
}


var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});


var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
};


var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap]     
});

streetmap.addTo(myMap);

var earthquakes = new L.LayerGroup();

var overlayMaps = {
    Earthquakes: earthquakes
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
    "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";


d3.json(queryUrl, function (data) {
    
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return new L.CircleMarker(latlng, {
                radius: radiusF(feature),
                fillOpacity: 0.85
            });
        },

        onEachFeature: popUpMsg,
        style: function (feature) {
            if (feature.geometry.coordinates[2] > 90) {
                return {

                    color: "#EA2C2C"
                }
            }
            else if (feature.geometry.coordinates[2] > 70) {
                return {

                    color: "#EA822C"
                }
            }
            else if (feature.geometry.coordinates[2] > 50) {
                return {

                    color: "#EE9C00"
                }
            }
            else if (feature.geometry.coordinates[2] > 30) {
               return {

                    color: "#EECC00"
               } 
            }
            else if (feature.geometry.coordinates[2] > 10) {
                return {

                    color: "#D4EE00"
                }
            }
            else {}
                return {
                
                    color: "#98EE00"
            };
        }

    }).addTo(earthquakes);

     

    earthquakes.addTo(myMap);
});

