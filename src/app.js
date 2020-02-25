const path = require('path');
const hbs = require('hbs');
const express = require('express');
const utils = require('./utils/utils');

const app = express();
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);

hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Juaid Rakin'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About me',
    name: 'Juaid Rakin'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    message: 'Search for a location and get the result!',
    title: 'Help',
    name: 'Juaid Rakin'
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide a address!'
    });
  }

  utils.geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({
          error: error
        });
      }

      utils.forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({
            error: error
          });
        }

        res.send({
          forecast: forecastData,
          location: location,
          address: req.query.address
        });
      });
    }
  );
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Juaid Rakin',
    errorMessage: 'Help article is not found'
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Juaid Rakin',
    errorMessage: 'Not found'
  });
});

app.listen(port, () => {
  console.log('listening...');
});
