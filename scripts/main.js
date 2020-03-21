('use strict');

/* Main Javascript file to contain the search and display functionality */

//define click behaviour for the search button
function searchCity() {
  //first grab the cityName from the input text
  let cityName = $('#cityName')
    .val()
    .trim();
  //what if invalid city? Show Error
  //Else add the City to fav. and show the current weather and then trigger the call to fetch and show the 5 days forecast

  openWeatherApi.getCurrentWeather(cityName, showCurrentWeather);
}

//function to display currentWeather from the api object
function showCurrentWeather(currentWeather) {
  if (
    currentWeather.cod === 404 &&
    currentWeather.message === 'city not found'
  ) {
    //Error handling
  } else if (
    currentWeather.hasOwnProperty('message') &&
    currentWeather.message.includes('Network response was not ok')
  ) {
    // More Error handling
  } else {
    //success!
    //make sure the panel is not hidden
    $('#currentWeatherDiv').removeClass('hide');
    //set the name of the city
    $('#cityWeatherToday').text(currentWeather.name);
    //set the temprature
    $('#currentTemp').text(
      'Temprature: ' +
        helper.tempratureToFarenheit(currentWeather.main['temp'], 'kelvin')
    ); //Temprature: 90F
    //set the humidity
    $('#currentHumid').text('Humidity: ' + currentWeather.main['humidity']);
    //set the wind speed
    $('#currentWind').text(
      'Wind Speed: ' + 2.37 * currentWeather.wind['speed']
    );
    //set the UV Index
    $('#currentUV').text(currentWeather.main[humidity]);
  }
}

$(document).ready(function() {
  //When the document load. Check in local storage for all the previously saved cityNames
  //If there are none to be found then

  //define click listeners
  $('#searchBtn').on('click', searchCity);
});
