// grillinmybus

var config = require('./config');
var ts = require('twitter-stream');
var express = require('express');
var busgrab = require('./busgrabber');
var app = express();

var stream = null;

function index (req, res) {
  res.send('grillinmybus')
}

function startStream(vehicles) {
  if (vehicles.length == 0) {
    console.log('no vehicles mutter!');
    return null;
  }
  console.log(JSON.stringify(vehicles[0]))
  lon = parseFloat(vehicles[0].longitude)
  lat = parseFloat(vehicles[0].latitude)
  console.log(lat + ':' + lon)
  stream = watchloc(lat, lon)
}

function update (req, res) {
  if (stream != null) {
    stream.abort()
  }

  busgrab.getBus('sf-muni', 'F', 0, startStream);
  //busgrab.getTrain(1, startStream)
  res.send('update');
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
