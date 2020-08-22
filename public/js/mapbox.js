/*eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYmFieWxlYXJuc3RvY29kZSIsImEiOiJja2R6bHRsY3Ezbmp6Mnd0dmFqN2RocXFhIn0.clWqbguDaGaIMBOrJvwyvw';
  var map = new mapboxgl.Map({
    // container= put map to element with ID #map
    container: 'map',
    style:
      'mapbox://styles/babylearnstocode/ckdzlyqbx0krh1amilsk970tt',
    //zoom disable
    scrollZoom: false,
    //interactive disable
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add Popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`)
      .addTo(map);
    //Extend the map bounds to include current Location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
