const request = require('request');

const geocode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=pk.eyJ1IjoianVhaWQiLCJhIjoiY2s2dGlzMDh0MGVoMjNscXNoYTZzZG5seiJ9.a9geL2xTmEuZtJABSbyf5Q&limit=1`;

  request({ url, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to the location service!', undefined);
    } else if (response.body.features.length === 0) {
      callback('Unable to find the location. Try another search!', undefined);
    } else {
      callback(undefined, {
        latitude: response.body.features[0].center[1],
        longitude: response.body.features[0].center[0],
        location: response.body.features[0].place_name
      });
    }
  });
};

const forecast = (latitude, longitude, callback) => {
  const url = `https://api.darksky.net/forecast/52a471609e7ed32fbf3b06dcc6485f57/${latitude},${longitude}?units=si`;

  request({ url, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to the weather service!', undefined);
    } else if (response.body.error) {
      callback('Unable to find the location', undefined);
    } else {
      callback(
        undefined,
        `${response.body.daily.data[0].summary} It's currently ${response.body.currently.temperature} degrees out there. And there is a ${response.body.currently.precipProbability}% chance of raining.`
      );
    }
  });
};

module.exports = {
  geocode: geocode,
  forecast: forecast
};
