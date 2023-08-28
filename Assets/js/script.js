const apiKey = "ffc69f7838e574f5064cf6010c451746";
const searchHistoryEl = document.getElementById("search-history-container");
const fiveDayForecastEl = document.getElementById("weather-forecast");
const searchInputEl = $("#city-input-form");
const cityEl = $("#city");
const currentCityEl = $("#selected-city");
const DateEl = $("#date-today");
const WeatherIconEl = $("#weather-icon");
const temperatureEl = $("#temp");
const windEl = $("#wind-mph");
const humidityEl = $("#humidity");

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

