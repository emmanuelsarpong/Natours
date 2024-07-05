/* eslint-disable */
document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('map');
  if (mapElement) {
    let locations = [];
    try {
      locations = JSON.parse(mapElement.dataset.locations);
      console.log('Parsed locations:', locations);
    } catch (error) {
      console.error('Error parsing locations data:', error);
      return;
    }

    if (typeof mapboxgl !== 'undefined') {
      mapboxgl.accessToken =
        'pk.eyJ1IjoiZW1tYW51ZWxzYXJwb25nIiwiYSI6ImNsd3FzbGFlNzA1cTUyanEwNHZ3eGdvc2EifQ._xg7sgSfctLjH3pG8bDS6Q';

      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
      });

      const bounds = new mapboxgl.LngLatBounds();

      // Add markers to the map
      locations.forEach((loc) => {
        console.log('Processing location:', loc);

        if (
          loc.coordinates &&
          Array.isArray(loc.coordinates) &&
          loc.coordinates.length === 2
        ) {
          const [lng, lat] = loc.coordinates;
          console.log('Coordinates:', lng, lat);

          if (!isNaN(lng) && !isNaN(lat)) {
            // Create marker
            const el = document.createElement('div');
            el.className = 'marker';

            // Add marker
            new mapboxgl.Marker({
              element: el,
              anchor: 'bottom',
            })
              .setLngLat([lng, lat])
              .addTo(map);

            console.log(`Added marker at [${lng}, ${lat}]`);

            new mapboxgl.Popup()
              .setLngLat(loc.coordinates)
              .setHTML(`<p> ${loc.day}: ${loc.description}<o>`);

            // Extend map bounds to include current location
            bounds.extend([lng, lat]);
          } else {
            console.error('Invalid coordinates for location:', loc);
          }
        } else {
          console.error('Invalid coordinates format for location:', loc);
        }
      });

      // Check if bounds have been extended at least once
      if (bounds.isEmpty()) {
        console.error('Bounds have not been extended with valid coordinates.');
      } else {
        // Fit the map to the bounds
        map.fitBounds(bounds, {
          padding: { top: 200, bottom: 200, left: 100, right: 100 },
        });
      }
    } else {
      console.error('Mapbox GL JS is not loaded.');
    }
  }
});
