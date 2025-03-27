/* eslint-disable */
export const displayMap = (locations) => {
  // Use your Mapbox access token
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZW1tYW51ZWxzYXJwb25nIiwiYSI6ImNsd3FybzNheDA1ZzAya3FlbXBtMXpuNWcifQ.5Nv6StZy-mr7fkfUrQaoEw';

  // Initialize the map
  const map = new mapboxgl.Map({
    container: 'map', // ID of the HTML element where the map will be displayed
    style: 'mapbox://styles/emmanuelsarpong/clwqro3ax05g02kqempm1zn5g', // Replace with your custom Mapbox style if applicable
    scrollZoom: false, // Disable scroll zoom
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Validate coordinates
    if (!loc.coordinates || loc.coordinates.length !== 2) {
      console.error('Invalid location:', loc);
      return; // Skip invalid locations
    }

    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker to the map
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup to the marker
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  // Adjust the map to fit the bounds of all locations
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
