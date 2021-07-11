var map;
const markers = [];

mapboxgl.accessToken = PERSONAL_MAPBOX_ACCESS_TOKEN;

const init = () => {
  const element = document.getElementById('map');
  map = new mapboxgl.Map({
    container: element,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.101, 42.358],
    zoom: 14,
  });
  addMarkers();
};

// Request bus data from MBTA
async function getBusLocations() {
  const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
  const response = await fetch(url);
  const json = await response.json();
  return json.data;
}

const addMarkers = async () => {
  var locations = await getBusLocations();

  locations.forEach(function (bus) {
    var marker = getMarker(bus.id);
    marker ? moveMarker(marker, bus) : addMarker(bus);
  });
  setTimeout(addMarkers, 15000);
};

const moveMarker = (marker, bus) => {
  marker.marker.setLngLat([bus.attributes.longitude, bus.attributes.latitude]);
};

const getMarker = (busId) => {
  return markers.find((bus) => bus.id === busId);
};

const addMarker = (bus) => {
  const marker = {
    id: bus.id,
    marker: new mapboxgl.Marker()
      .setLngLat([bus.attributes.longitude, bus.attributes.latitude])
      .addTo(map),
  };
  markers.push(marker);
};

init();
