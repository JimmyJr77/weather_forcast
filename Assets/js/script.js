const apiKey = "ffc69f7838e574f5064cf6010c451746";
const searchHistoryContainerEl = document.getElementById("search-history-container");
const weatherForecastContainer = document.getElementById("weather-forecast-container");
const searchInputEl = $("#city-input-form");
const cityEl = $("#city");
const selectedCityEl = $("#selected-city");
const DateEl = $("#date-today");
const WeatherIconEl = $("#weather-icon");
const tempEl = $("#temp");
const windEl = $("#wind-mph");
const humidityEl = $("#humidity");

// MAKE THE 8 BALL SHAKE ON SCREEN CLICK

// Add a click event listener to make the 8 ball shake
$(document).ready(function() {
    $("body").on("click", function() {
        $("#shaking-div").addClass("shake");

        // Remove the shake class after the animation completes
        setTimeout(function() {
            $("#shaking-div").removeClass("shake");
        }, 500); // 500ms matches the animation duration in the CSS
    });
});

// API CALLS

// Get the current weather in the selected city
async function currentWeather(cityName) {
    try {
        const requestCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;
        const response = await fetch(requestCurrent);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        selectedCityEl.text(data.name);
        DateEl.text(dayjs().format("dddd, MMM DD, YYYY"));
        WeatherIconEl.attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`).css({"background-color": "dodgerblue", "margin-bottom": "20px"});
        tempEl.html(`<strong>Temperature:</strong> ${data.main.temp}\u00B0F`).css({"color": "dodgerblue", "margin-bottom": "20px", "font-size": "20px" });
        windEl.html(`<strong>Wind Speed:</strong> ${data.wind.speed} MPH`).css({"color": "dodgerblue", "margin-bottom": "20px", "font-size": "20px"});
        humidityEl.html(`<strong>Humidity:</strong> ${data.main.humidity}%`).css({"color": "dodgerblue", "margin-bottom": "20px", "font-size": "20px"});

        previousSearches(data.name);  // adds this city to the previously searched list

    } catch (error) {
        console.error('Concentrate and ask again:', error.message);
    }
}


async function forecastedWeather(cityName) {
    try {
        const requestForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`;
        const response = await fetch(requestForecast);

        if (!response.ok) {
            throw new Error('Outlook not so good: "No network response"');
        }

        const data = await response.json();

        const weatherForecastContainer = document.getElementById('weather-forecast-container');
        const forecastCards = weatherForecastContainer.getElementsByClassName('weather-card');
        const forecastHeading = document.getElementById('forecast-heading');

        forecastHeading.textContent = `${data.city.name}'s 5-Day Forecast:`; 

        // API returns 3-hour increment predictions, so every 8 returns is a new day.
        for (let i = 7, l = 0; l < 5 && i < data.list.length; i += 8, l++) {
            const card = forecastCards[l];
            
            const forecastDate = card.querySelector('.forecast-date');
            forecastDate.textContent = dayjs(data.list[i].dt_txt).format("dddd, MMM DD, YYYY");            
            
            const forecastIcon = card.querySelector('.forecast-icon');
            forecastIcon.src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
            
            const forecastTemp = card.querySelector('.forecast-temp');
            forecastTemp.innerHTML = `<strong>Temp: </strong> ${data.list[i].main.temp}\u00B0F`;
            
            const forecastWind = card.querySelector('.forecast-wind');
            forecastWind.innerHTML = `<strong>Wind: </strong> ${data.list[i].wind.speed} MPH`;
            
            const forecastHumidity = card.querySelector('.forecast-humidity');
            forecastHumidity.innerHTML = `<strong>Humidity: </strong> ${ data.list[i].main.humidity}%`;
        }

        weatherForecastContainer.style.display = 'block';  

    } catch (error) {
        console.error('Concentrate and ask again:', error.message);
    }
}

// SEARCH WEATHER BY CITY

// Function to return the weather for a selected city
function handleWeatherRequest(event) {
    event.preventDefault();

    let cityName;

    if (this === searchInputEl[0]) { // Check if the event is from the form submit
        cityName = cityEl.val();
        searchInputEl[0].reset();
    } else {
        cityName = $(this).text();
    }

    currentWeather(cityName);
    forecastedWeather(cityName);
}

searchInputEl.on("submit", handleWeatherRequest);
$(searchHistoryContainerEl).on("click", "button", handleWeatherRequest);

// SEARCH HISTORY

// Stores last 7 searched cities in local storage
function previousSearches(cityName) {
    let citiesSearched = JSON.parse(localStorage.getItem("searchedCities"));

    if (!citiesSearched) {
        citiesSearched = [];
    }

    // Check if the city already exists, if so remove it to update its recent search position
    const cityIndex = citiesSearched.indexOf(cityName);
    if (cityIndex !== -1) {
        citiesSearched.splice(cityIndex, 1);
    }
    
    // Add the new city to the end of the list
    citiesSearched.push(cityName);
    
    // Check if the array exceeds 7 cities and remove the oldest one if true
    while (citiesSearched.length > 7) {
        citiesSearched.shift();
    }

    localStorage.setItem("searchedCities", JSON.stringify(citiesSearched));
    printSearchedCities();
}

// This function renders the savedCities to the saved-cities-container
function printSearchedCities() {
    const citiesHistory = JSON.parse(localStorage.getItem("searchedCities"));
    if (!citiesHistory) {
        return;
    }

    searchHistoryContainerEl.innerHTML = "";

    citiesHistory.forEach((element) => {
        const pastCitiesBtn = document.createElement("button");
        pastCitiesBtn.setAttribute("id", element);
        pastCitiesBtn.setAttribute(
            "class",
            "btn search-history-btn btn-lg btn-block my-1"  // added 'btn-dodgerblue' and 'my-1' for vertical margin
        );
        pastCitiesBtn.textContent = element;
        searchHistoryContainerEl.append(pastCitiesBtn);
    });
}

printSearchedCities();
