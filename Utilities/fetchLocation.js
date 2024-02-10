const axios = require('axios');

async function fetchCountryAndCity(latitude, longitude) {
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const results = response.data.results;
        if (results.length > 0) {
            const addressComponents = results[0].address_components;
            const country = addressComponents.find(component => component.types.includes('country'));
            const city = addressComponents.find(component => component.types.includes('locality'));
            return { country: country.long_name, city: city.long_name };
        } else {
            return null; // No results found
        }
    } catch (error) {
        console.error('Error fetching country and city:', error);
        return null;
    }
}

// Example usage
const latitude = 40.7128;
const longitude = -74.006;
fetchCountryAndCity(latitude, longitude)
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
