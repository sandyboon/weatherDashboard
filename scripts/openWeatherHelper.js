('use strict');

const api_Ampersand = '&appid=';
const openWeatherApi = {
  apiKey: '9bed288a78e9fda72e94c9fd3a1abd87',
  rootUrl: 'https://api.openweathermap.org/data/2.5/weather',
  currentWeatherForCityUrl: function(cityName) {
    return this.rootUrl + '?q=' + cityName + api_Ampersand + this.apiKey;
  }
};

openWeatherApi.getCurrentWeather = function(cityName) {
  fetch(this.currentWeatherForCityUrl).then(function(response) {
    if(!{response.ok){
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
};
