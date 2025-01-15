// Dynamically load the Google Maps API script
function loadGoogleMapsAPI() {
  const script = document.createElement('script');
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC2ucqxYaMcdp7dXTume-EBWL56jin7jVs&libraries=places&callback=initMap";
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}

// Callback function to initialize the map
window.initMap = initMap;

let map;
let marker;

// Initialize and add the map
function initMap() {
  const position = { lat: 51.5074, lng: -0.1278 }; // Default location (London)

  // Create the map
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: position,
  });

  // Add a marker at the default location
  marker = new google.maps.Marker({
    position: position,
    map: map,
    title: "London",
  });

  console.log("Map initialized successfully.");
}

// Attach event listener to search button
document.getElementById("search-button").addEventListener("click", searchPlaces);

// Search for places and update the map
function searchPlaces() {
  const searchInput = document.getElementById("search-input");
  const query = searchInput.value;

  if (!query) {
    alert("Please enter a location to search.");
    return;
  }

  const service = new google.maps.places.PlacesService(map);

  service.textSearch({ query }, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
      const place = results[0];
      const location = place.geometry.location;

      // Update map and marker
      map.setCenter(location);
      map.setZoom(15);
      marker.setPosition(location);
      marker.setTitle(place.name);

      console.log(`Search successful: ${place.name}`);
      getRecommendations(location.lat(), location.lng());
    } else {
      alert("City not found. Please try again.");
    }
  });
}

// Get recommendations for nearby places
function getRecommendations(lat, lng) {
  const placesService = new google.maps.places.PlacesService(map);

  // Clear previous results
  clearResults();

  // Fetch recommendations for each category
  fetchPlaces(placesService, { location: { lat, lng }, radius: 5000, type: "lodging" }, "accommodation");
  fetchPlaces(placesService, { location: { lat, lng }, radius: 5000, type: "restaurant" }, "restaurants");
  fetchPlaces(placesService, { location: { lat, lng }, radius: 5000, type: "tourist_attraction" }, "attractions");
}

// Clear results before fetching new ones
function clearResults() {
  document.getElementById("accommodation").innerHTML = "<h3>Accommodation</h3><ul></ul>";
  document.getElementById("restaurants").innerHTML = "<h3>Restaurants</h3><ul></ul>";
  document.getElementById("attractions").innerHTML = "<h3>Attractions</h3><ul></ul>";
}

// Fetch and display places
function fetchPlaces(service, request, section) {
  service.nearbySearch(request, function (results, status) {
    const ul = document.querySelector(`#${section} ul`);

    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(function (place) {
        const li = document.createElement("li");
        li.textContent = place.name;
        ul.appendChild(li);
      });
    } else {
      document.getElementById(section).innerHTML += `<p>No ${section} found.</p>`;
    }
  });
}

// Load Google Maps API when the page is ready
window.onload = loadGoogleMapsAPI;
