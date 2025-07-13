mapboxgl.accessToken = mapToken;
console.log(mapToken);
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 10, // starting zoom
});

// console.log(coordinates);

const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .addTo(map);

const layerList = document.getElementById("menu");
const inputs = layerList.getElementsByTagName("input");

for (const input of inputs) {
  input.onclick = (layer) => {
    const layerId = layer.target.id;
    map.setStyle("mapbox://styles/mapbox/" + layerId);
  };
}

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Add a scale control to the map
map.addControl(new mapboxgl.ScaleControl());


map.addControl(new mapboxgl.FullscreenControl());

map.on('style.load', () => {
    map.setConfigProperty('basemap', 'lightPreset', 'dusk');
  });
