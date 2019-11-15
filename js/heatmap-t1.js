var geoData = [];
var metaData_1 = [];
var metaData_2 = [];
 
queue()
    .defer(d3.csv, "data/NFHS4_District_Undernourished.csv")
    .await(create_chart);

function create_chart(error,data){
// function create_chart(error,data){
$('#chart').height(height);

var width = $('#chart').width();
var height = width/2;
var heatmap;
$('#chart').height(height);


data.forEach(function(d) { //Stunting
    geoData.push([d["Latitude"], d["Longitude"], d["Stunting"]]);
    metaData_1.push([d["Latitude"], d["Longitude"], d["Underweight"]])
    metaData_2.push([d["Latitude"], d["Longitude"], d["Wasting"]])
});


mapLink = '<a href="https://openstreetmap.in/demo">OpenStreetMap</a>';
var mainmap = L.tileLayer(
    'https://{s}.tiles.mapbox.com/v4/openstreetmap.1b68f018/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaGFyc2hpdGhhcmF2aW5kcmEiLCJhIjoiY2pseGtyNXU0MWZtYTNwcW5tM2Y4cnRjNCJ9.zlFeO5rHF5shM4TjIh_aFg', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 15,     
  });

var heat = L.heatLayer(geoData,{// HAZ_SeverarlyStunted - Red
    radius: 10,
    blur: 10, 
    maxZoom: 1,
    gradient: {
            0.0: '#996666',
            0.5: '#bf3f3f',
            1.0: '#ff0000'
        },
});

var markerLayer = L.heatLayer(metaData_1,{ //HAZ_SeverarlyUnderweight - Green 
    radius: 10,
    blur: 15, 
    maxZoom: 1,
    gradient: {
            0.0: '#679967',
            0.5: '#40c040',
            1.0: '#00ff00'
        },
});

var markerLayer_1 = L.heatLayer(metaData_2,{//HAZ_SeverarlyWasted - Blue
    radius: 10,
    blur: 20, 
    maxZoom: 1,
    gradient: {
            0.0: '#666698',
            0.5: '#403fbf',
            1.0: '#0000ff'
        },
});

var map = L.map('map',{
      layers: [mainmap, heat, markerLayer,markerLayer_1]

    });
map.setView([22.572646, 88.363895], 5);
     
var baseMaps = {
      "BaseMap": mainmap        
};

var overlayMaps = {
    "Stunting": heat, // Stunting
    "UnderWeight": markerLayer, // UnderWeight 
    "Wasted" : markerLayer_1 }; // Wasted

mainmap.addTo(map);
L.control.layers(baseMaps,overlayMaps).addTo(map);

}