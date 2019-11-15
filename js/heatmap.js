function Heatmap() {
    var cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        "radius": 0.5,
        "maxOpacity": 1.0,

        // scales the radius based on map zoom
        "scaleRadius": true,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries
        //   (there will always be a red spot with useLocalExtremas true)
        "useLocalExtrema": true,
        "gradient": {
            // enter n keys between 0 and 1 here
            // for gradient color customization
            '.3': 'blue',
            '.5': 'Green',
            '.7': 'yellow'
        },
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        valueField: 'count'
    };
        mapLink = '<a href="https://openstreetmap.in/demo">OpenStreetMap</a>';
        ossLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v4/openstreetmap.1b68f018/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaGFyc2hpdGhhcmF2aW5kcmEiLCJhIjoiY2pseGtyNXU0MWZtYTNwcW5tM2Y4cnRjNCJ9.zlFeO5rHF5shM4TjIh_aFg', {
                                attribution: '&copy; ' + mapLink + ' Contributors',
                                maxZoom: 15,});

var map = new L.Map('map');

if(map != undefined || map != null){
    map.remove();     } 

map.setView([20.5937, 78.9629], 5 );

// var map = L.map('map').setView([20.5937, 78.9629], 5);
mapLink = '<a href="https://openstreetmap.in/demo">OpenStreetMap</a>';
L.tileLayer(
    'https://{s}.tiles.mapbox.com/v4/openstreetmap.1b68f018/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaGFyc2hpdGhhcmF2aW5kcmEiLCJhIjoiY2pseGtyNXU0MWZtYTNwcW5tM2Y4cnRjNCJ9.zlFeO5rHF5shM4TjIh_aFg', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 15,     
  }).addTo(map);
//      var roadmapLayer = L.gridLayer.googleMutant({ maxZoom: 24, type: 'roadmap' });

    var heatmapLayer, map, layer, field_value,
        fields = [],
        lat = 'lat',
        lng = 'lng';

    function chart(selection){
        selection.each(function(data){
            
            heatmapLayer = new HeatmapOverlay(cfg);
            var baseLayers = {
//                    'Google Roadmap': roadmapLayer,
                    "OpenStreetMap": ossLayer,
                };

            var overlays = {
                    "Heatmap": heatmapLayer
            };
            map = new L.Map('chart', {
                center: new L.LatLng(20.5937, 78.9629),
                zoom: 4,
                layers: [ossLayer, heatmapLayer]
            });

            L.control.layers(baseLayers, overlays).addTo(map);

            plot_data = {
              max: 8,
              data: count_fields(data)
            }
            //heatmapLayer.setData(plot_data);
            layer = heatmapLayer;
        })
    }

    function count_fields(data){
        var d = {},
            result = [];
        for(var i = 0; i < data.length; i++){
            if(typeof d[String(data[i][lat]) + '-' + String(data[i][lng])] === 'undefined'){
                d[String(data[i][lat]) + '-' + String(data[i][lng])] = 0;
            }
            for(j in fields){
                d[String(data[i][lat]) + '-' + String(data[i][lng])] = d[String(data[i][lat]) + '-' + String(data[i][lng])] + (parseFloat(data[i][fields[j]]) == field_value ? 1 : 0);
            }
        }
        for(i in d){
          if(d[i] > 0){ // heatmap shows something for 0 value also hence I am removing this out
            result.push({
              'lat': parseFloat(i.split('-')[0]),
              'lng': parseFloat(i.split('-')[1]),
              'count': d[i],
            });
          }
        }
        console.log(result)
        return result;
    }

    chart.fields = function(_){
      if (!arguments.length) return fields
      fields = _;
      return chart
    }

    chart.lat = function(_){
      if (!arguments.length) return lat
      lat = _;
      return chart
    }

    chart.lng = function(_){
      if (!arguments.length) return lng
      lng = _;
      return chart
    }

    chart.update = function(period_data){
        plot_data = {
          max: 8,
          data: count_fields(period_data)
        }
        heatmapLayer.setData(plot_data)
    }

    chart.field_value = function(_){
      if (!arguments.length) return field_value
      field_value = _;
      return chart
    }


    return chart;
}
