// grillinmybus

var ts = require('twitter-stream');

var stream = ts.connect({
  screen_name: '',
  password: '',
  action: 'sample',
  params: {locations: '-71.1832,42.3565,-71.1834,42.3567'},
});
