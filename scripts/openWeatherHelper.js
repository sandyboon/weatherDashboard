('use strict');

const api_Ampersand = '&appid=';
const openWeatherApi = {
  apiKey: '9bed288a78e9fda72e94c9fd3a1abd87',
  rootUrl: 'http://api.openweathermap.org/data/2.5/weather',
  rootUVIndexUrl: 'https://samples.openweathermap.org/data/2.5/uvi?', //http://api.openweathermap.org/data/2.5/uvi
  currentWeatherForCityUrl: function(cityName) {
    let url = this.rootUrl + '?q=' + cityName + api_Ampersand + this.apiKey;
    console.log('url is : ' + url);
    return url;
  },
  currentUVIndexUrl: function(lat, lon) {
    let url = `http://api.openweathermap.org/data/2.5/uvi?appid=9bed288a78e9fda72e94c9fd3a1abd87&lat=${lat}&lon=${lon}`;
    console.log('url is : ' + url);
    return url;
  }
};

openWeatherApi.getCurrentWeather = function(
  cityName,
  showCurrentWeather,
  displayUVIndexFunction
) {
  fetch(this.currentWeatherForCityUrl(cityName))
    .then(function(response) {
      if (!response.ok) {
        throw new Error(
          'Error Code : ' +
            response.status +
            'Error Message: ' +
            response.statusText
        );
      }
      return response.json();
    })
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
      console.error(
        'There has been a problem with the fetch operation:',
        error
      );
      return showCurrentWeather(error);
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
