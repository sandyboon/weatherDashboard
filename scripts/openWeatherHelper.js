('use strict');

const api_Ampersand = '&appid=';
const openWeatherApi = {
  apiKey: '9bed288a78e9fda72e94c9fd3a1abd87',
  rootUrl: 'https://api.openweathermap.org/data/2.5/weather',
  rootUVIndexUrl: 'https://samples.openweathermap.org/data/2.5/uvi?', //http://api.openweathermap.org/data/2.5/uvi
  currentWeatherForCityUrl: function(cityName) {
    let url = this.rootUrl + '?q=' + cityName + api_Ampersand + this.apiKey;
    console.log('currentWeatherForCityUrl url is : ' + url);
    return url;
  },
  currentUVIndexUrl: function(lat, lon) {
    let url = `https://api.openweathermap.org/data/2.5/uvi?appid=9bed288a78e9fda72e94c9fd3a1abd87&lat=${lat}&lon=${lon}`;
    console.log('currentUVIndexUrl url is : ' + url);
    return url;
  },
  fiveDayForecastUrl: function(cityName) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${this.apiKey}`;
    console.log('fiveDayForecastUrl url is : ' + url);
    return url;
  }
};

const parseResponse = function(response) {
  if (!response.ok) {
    throw new Error(
      'Error Code : ' +
        response.status +
        'Error Message: ' +
        response.statusText
    );
  }
  return response.json();
};

openWeatherApi.getCurrentWeather = function(
  cityName,
  showCurrentWeather,
  displayUVIndexFunction,
  erroHandler
) {
  fetch(this.currentWeatherForCityUrl(cityName))
    .then(parseResponse)
    .then(function(data) {
      //make the fetch call for UV index
      openWeatherApi.getCurrentUVIndex(
        data.coord['lat'],
        data.coord['lon'],
        displayUVIndexFunction
      );
      return showCurrentWeather(data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      return erroHandler(error);
    });
};

openWeatherApi.getForecast = function(cityName, showForeCast, erroHandler) {
  fetch(this.fiveDayForecastUrl(cityName))
    .then(parseResponse)
    .then(showForeCast)
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      return erroHandler(error);
    });
};

openWeatherApi.getCurrentUVIndex = function(lat, lon, displayUVIndexFunction) {
  fetch(this.currentUVIndexUrl(lat, lon))
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Network response was not ok' + response.statusText);
      }
      return response.json();
    })
    .then(function(data) {
      return displayUVIndexFunction(data);
    });
};
