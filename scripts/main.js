('use strict');

/* Main Javascript file to contain the search and display functionality */
const localStorageKey = 'citiesSearched';

//define click behaviour for the search button
function searchCity() {
  //first grab the cityName from the input text
  let cityName = $('#cityName')
    .val()
    .trim();
  //what if invalid city? Show Error
  //Else add the City to fav. and show the current weather and then trigger the call to fetch and show the 5 days forecast

  fetchCurrentWeather(cityName);
}

function fetchCurrentWeather(cityName) {
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
  //set the name of the city and the time stamp.
  $('#cityWeatherToday').text(
    currentWeather.name + ' (' + getTimeStamp(currentWeather) + ')'
  );
  //set the weathe image
  $('#currentWImage').attr('src', getCurrentImageUrl(currentWeather));
  //set the temprature
  $('#currentTemp').html(
    'Temprature: ' +
      helper
        .tempratureToFarenheit(currentWeather.main['temp'], 'kelvin')
        .toFixed(1) +
      ' &#x2109;'
  ); //Temprature: 90F
  //set the humidity
  $('#currentHumid').text(
    'Humidity: ' + currentWeather.main['humidity'] + ' %'
  );
  //set the wind speed
  $('#currentWind').text(
    'Wind Speed: ' + (2.37 * currentWeather.wind['speed']).toFixed(1) + ' MPH'
  );
  //Now add the searched city to recently searched city side-bar
  addCityToSideBar(currentWeather.name);
}

function addCityToSideBar(cityName) {
  let recentlySearchedCitiesDiv = $('#recentlySearchedCities');
  //see if the city is alread in the recently searched city side-bar
  if (recentlySearchedCitiesDiv.find('#' + cityName + 'row').length >= 1) {
    return;
  }
  let newCityRow = bootStrapHelper.getBootStrapGridRow(
    cityName + 'row',
    '<div>'
  );
  let newCityCol = bootStrapHelper.getootStrapGridColumn(
    cityName,
    '<div>',
    'col-8 weatherBoarder btnCursor ml-3'
  );
  let citNameParagraph = bootStrapHelper.createJqueryDomElement(
    cityName + '-p',
    '<p>'
  );
  citNameParagraph.text(cityName);
  newCityCol.append(citNameParagraph);
  newCityRow.append(newCityCol);
  recentlySearchedCitiesDiv.append(newCityRow);
  //store the cityname
  storeCityNameInStorage(cityName);
  //animate//
  animateSidebarColumn(newCityCol);
  //define click behaviour for the newly added column
  newCityCol.click(function(event) {
    console.log('event ' + event);
    console.log('event target ' + event.target);
    console.log('this ' + this);
    fetchCurrentWeather(this.innerText);
  });
  newCityCol.click(function(event) {
    animateSidebarColumn($(this));
  });
  // //onhover highlight
  // newCityCol.hover(function(event) {
  //   $(this).removeClass('weatherBoarder');
  //   $(this).addClass('highlightBorder');
  // });
}

function animateSidebarColumn(newCityCol) {
  newCityCol.animate({ paddingLeft: '+=20px' }, 'fast');
  newCityCol.animate({ 'border-color': '#0e7796' }, 'fast');
  newCityCol.animate({ paddingLeft: '-=20px' }, 'fast');
  newCityCol.animate({ 'border-color': '#dfdfdf' }, 'slow');
  // newCityCol.stop();
  // newCityCol.addClass('ml-3');
  // newCityCol.removeAttr('style');
}

function storeCityNameInStorage(cityName) {
  //try and retrieve what's stored in storage
  let citiesInStorage = localStorage.getItem(localStorageKey);
  if (citiesInStorage === null) {
    //first insertion
    localStorage.setItem(localStorageKey, cityName);
  } else {
    //retrieve whats in there
    let currentlyStored = localStorage.getItem(localStorageKey);
    currentlyStored = currentlyStored.concat(',').concat(cityName);
    //push it back in
    localStorage.setItem(localStorageKey, currentlyStored);
  }
}

function getCurrentImageUrl(currentWeather) {
  let rootImageUrl = 'https://openweathermap.org/img/wn/';
  return rootImageUrl + currentWeather.weather[0].icon + '.png';
}

function getTimeStamp(currentWeather) {
  let unixTimeInSeconds = currentWeather.dt;
  return moment.unix(unixTimeInSeconds).format('YYYY/MM/DD');
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
