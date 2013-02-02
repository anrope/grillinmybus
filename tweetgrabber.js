// grillinmybus

var config = require('./config');
var ts = require('twitter-stream');
var express = require('express');

var app = express();

var stream = null;

function index (req, res) {
  res.send('grillinmybus')
}

function update (req, res) {
  if (stream != null) {
    stream.abort()
  }
  stream = watchloc(42.370149, -71.078196);

  res.send('update')
}

function watchloc (lat, lon) {
  sw_lat = lat - .0001;
  sw_lon = lon - .0001;
  ne_lat = lat + .0001;
  ne_lon = lon + .0001;

  var locations = sw_lon + ',' + sw_lat + ',' + ne_lon + ',' + ne_lat;

  var stream = ts.connect({
    screen_name: config.screen_name,
    password: config.password,
    action: 'filter',
    params: {locations: locations},
  });

  stream.on('status', function (status) {
    console.log(status['text']);
  });

  stream.on('error', function (error) {
    console.error('Error: ' + error);
  });

  return stream
}

app.all('/', index);
app.get('/1/update', update);

app.listen(8778);
