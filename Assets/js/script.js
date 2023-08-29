$(document).ready(function() {

    // Constants and Variables
    const apiKey = "ffc69f7838e574f5064cf6010c451746";
    const NUM_DAYS_TO_FORECAST = 5;

    const searchHistoryContainerEl = $("#search-history-container");
    const weatherForecastContainer = $("#weather-forecast-container");
    const searchInputEl = $("#city-input-form");
    const cityEl = $("#city");
    const selectedCityEl = $("#selected-city");
    const DateEl = $("#date-today");
    const WeatherIconEl = $("#weather-icon");
    const tempEl = $("#temp");
    const windEl = $("#wind-mph");
    const humidityEl = $("#humidity");

    // Initialize
    printSearchedCities();

    // Helper function to update weather card UI
    function updateWeatherCard(element, content) {
        element.html(content).css({
            "color": "dodgerblue",
            "margin-bottom": "20px",
            "font-size": "20px"
        });
    }

    // Function to get current weather information
    async function currentWeather(cityName) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            updateUIElements(data);
            previousSearches(cityName);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    // Function to update UI elements
    function updateUIElements(data) {
        selectedCityEl.text(data.name);
        DateEl.text(dayjs().format("dddd, MMM DD, YYYY"));
        WeatherIconEl.attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        updateWeatherCard(tempEl, `<strong>Temperature:</strong> ${data.main.temp}°F`);
        updateWeatherCard(windEl, `<strong>Wind Speed:</strong> ${data.wind.speed} MPH`);
        updateWeatherCard(humidityEl, `<strong>Humidity:</strong> ${data.main.humidity}%`);
    }

    // Function to get forecasted weather information
    async function forecastedWeather(cityName) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            updateForecastUIElements(data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

// Function to update forecast UI elements
function updateForecastUIElements(data) {
    const forecastCards = weatherForecastContainer.find('.weather-card');
    const forecastHeading = $('#forecast-heading');
    console.log("Forecast Data:", data);
    
    // Make the forecast container visible
    weatherForecastContainer.show();
    
    forecastHeading.text(`${data.city.name}'s ${NUM_DAYS_TO_FORECAST}-Day Forecast:`);
    
    for (let i = 7, l = 0; l < NUM_DAYS_TO_FORECAST && i < data.list.length; i += 8, l++) {
        const card = $(forecastCards[l]);
        card.find('.forecast-date').text(dayjs(data.list[i].dt_txt).format("dddd, MMM DD, YYYY"));
        card.find('.forecast-icon').attr("src", `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`);
        card.find('.forecast-temp').html(`<strong>Temp: </strong> ${data.list[i].main.temp}°F`);
        card.find('.forecast-wind').html(`<strong>Wind: </strong> ${data.list[i].wind.speed} MPH`);
        card.find('.forecast-humidity').html(`<strong>Humidity: </strong> ${data.list[i].main.humidity}%`);
    }
}


    // Event handler for weather request
    function handleWeatherRequest(event) {
        event.preventDefault();
        const cityName = event.target === searchInputEl[0] ? cityEl.val() : $(this).text();
        searchInputEl[0].reset();
        currentWeather(cityName);
        forecastedWeather(cityName);
    }

    // Attach event listeners
    searchInputEl.on("submit", handleWeatherRequest);
    searchHistoryContainerEl.on("click", "button", handleWeatherRequest);

    // SEARCH HISTORY

    function previousSearches(cityName) {
        let citiesSearched = JSON.parse(localStorage.getItem("searchedCities")) || [];

        // Remove if exists, to re-add it to the end
        const index = citiesSearched.indexOf(cityName);
        if (index !== -1) {
            citiesSearched.splice(index, 1);
        }
        
        citiesSearched.push(cityName);
        while (citiesSearched.length > 7) {
            citiesSearched.shift();
        }
        
        localStorage.setItem("searchedCities", JSON.stringify(citiesSearched));
        printSearchedCities();
    }

    function printSearchedCities() {
        const citiesHistory = JSON.parse(localStorage.getItem("searchedCities")) || [];
        searchHistoryContainerEl.empty();

        citiesHistory.forEach((city) => {
            const btn = $('<button>').addClass('btn search-history-btn btn-lg btn-block my-1').text(city);
            searchHistoryContainerEl.append(btn);
        });
    }
});
