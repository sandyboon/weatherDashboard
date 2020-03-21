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

  openWeatherApi.getCurrentWeather(
    cityName,
    showCurrentWeather,
    showUVIndex,
    handleError
  );
}

//function to display currentWeather from the api object
function showCurrentWeather(currentWeather) {
  //success!
  //make sure the panel is not hidden
  $('#currentWeatherDiv').removeClass('hide');
  //set the name of the city
  $('#cityWeatherToday').text(currentWeather.name);
  //set the temprature
  $('#currentTemp').html(
    'Temprature: ' +
      helper
        .tempratureToFarenheit(currentWeather.main['temp'], 'kelvin')
        .toFixed(1) +
      ' &#x2109;'
  ); //Temprature: 90F
  //set the humidity
  $('#currentHumid').text('Humidity: ' + currentWeather.main['humidity']);
  //set the wind speed
  $('#currentWind').text(
    'Wind Speed: ' + (2.37 * currentWeather.wind['speed']).toFixed(1)
  );
}

function showUVIndex(uvIndexObj) {
  //set the UV Index
  $('#currentUV').text(uvIndexObj.value);
}

function handleError(error) {
  let displayMessage = '';
  if (
    error.hasOwnProperty('message') &&
    error.message.includes('Error Code : 404')
  ) {
    displayMessage = 'City not found!';
    //Error handling. Show a proper message
  } else if (
    error.hasOwnProperty('message') &&
    error.message.includes('Network response was not ok')
  ) {
    displayMessage = 'Network Error!';
  }
  $('#cityName').addClass('inputError');
  $('#errorMessage').text(displayMessage);
}

function removeErrorsIfAny() {
  $('#errorMessage').text(''); //empty the error message
  $('#cityName').removeClass('inputError');
  //enable the button
  let searchedCityName = $('#cityName')
    .val()
    .trim();
  if (searchedCityName.length > 1) {
    $('#searchBtn').removeAttr('disabled');
  } else {
    $('#searchBtn').attr('disabled', true);
  }
}

$(document).ready(function() {
  //When the document load. Check in local storage for all the previously saved cityNames
  //If there are none to be found then

  //define listeners
  $('#searchBtn').on('click', searchCity);
  $('#cityName').keydown(removeErrorsIfAny);
});
