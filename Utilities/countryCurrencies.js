const axios = require('axios');

async function fetchCountryInfo(countryName) {
    const url = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
    try {
        const response = await axios.get(url);
        return response.data[0]; // Assuming the first result is the correct one
    } catch (error) {
        console.error('Error fetching country information:', error);
        return null;
    }
}

async function fetchCityInfo(cityName) {
    const url = `http://api.geonames.org/searchJSON?q=${cityName}&maxRows=1&username=your_username`;
    try {
        const response = await axios.get(url);
        return response.data.geonames[0]; // Assuming the first result is the correct one
    } catch (error) {
        console.error('Error fetching city information:', error);
        return null;
    }
}

async function fetchCurrencyInfo(countryCode) {
    const url = `https://openexchangerates.org/api/currencies.json`;
    try {
        const response = await axios.get(url);
        return response.data[countryCode];
    } catch (error) {
        console.error('Error fetching currency information:', error);
        return null;
    }
}

// Example usage
(async () => {
    const countryInfo = await fetchCountryInfo('United States');
    console.log('Country Info:', countryInfo);

    const cityInfo = await fetchCityInfo('New York');
    console.log('City Info:', cityInfo);

    const currencyInfo = await fetchCurrencyInfo('USD');
    console.log('Currency Info:', currencyInfo);
})();
