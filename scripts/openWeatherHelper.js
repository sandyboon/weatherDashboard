('use strict');

const api_Ampersand = '&appid=';
const openWeatherApi = {
  apiKey: '9bed288a78e9fda72e94c9fd3a1abd87',
  rootUrl: 'https://api.openweathermap.org/data/2.5/weather',
  currentWeatherForCityUrl: function(cityName) {
    let url = this.rootUrl + '?q=' + cityName + api_Ampersand + this.apiKey;
    console.log('url is : ' + url);
    return url;
  }
};

openWeatherApi.getCurrentWeather = function(cityName, callbackFunction) {
  fetch(this.currentWeatherForCityUrl(cityName))
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Network response was not ok' + response.statusText);
      }
      return response.json();
    })
    .then(function(data) {
      return callbackFunction(data);
    });

  // .catch(error => {
  //   console.error(
  //     'There has been a problem with the fetch operation:',
  //     error
  //   );
  //   return { message: 'Error : ' + error };
  // });
};
