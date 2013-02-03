var libxmljs = require("libxmljs");
var request = require('request');


function VehicleLog(kind) {
    this.id=null;
    this.longitude=null;
    this.latitude=null;
    this.timestamp=null;
    this.kind = kind;
}

module.exports.getBus = function (agency_tag, route_tag, time, cb)
{
        var bus_info = [];
        var start = new Date().getTime();
        
        //make request for bus info
        request('http://webservices.nextbus.com/service/publicXMLFeed?' +
            'command=vehicleLocations&a=' + agency_tag + '&r=' + route_tag  + '&t=' + time,
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                console.log('success buses');
                
                var xmlDoc = libxmljs.parseXmlString(body);
                var logs = xmlDoc.get('//body').childNodes();
                console.log('number of logs:' + logs.length);
                
                logs.forEach(function(log) {
                    if(log != null && log.attr('lon')) {
                        var vehicle = new VehicleLog('bus');
                        vehicle.timestamp = start + parseInt(log.attr('secsSinceReport').value());
                        vehicle.longitude = log.attr('lon').value();
                        vehicle.latitude = log.attr('lat').value();
                        vehicle.id = log.attr('id').value();
                        bus_info.push(vehicle);
                    }
                });
                console.log('full bus length:' + bus_info.length);
                cb(bus_info);
        }
        });

}

module.exports.getTrain = function (train_id, cb)
{
        var train_info = [];
        
        //make request for bus info
        request('http://developer.mbta.com/lib/RTCR/RailLine_' + train_id + '.json',
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('success trains');
                    trains = JSON.parse(body);
                    console.log('number of trains:' + trains.Messages.length);

                    trains.Messages.forEach(function(train_log) {
                        if(train_log != null) {
                            var vehicle = new VehicleLog('train');
                            train_log.forEach(function(train) {
                                if (train.Key == 'TimeStamp')
                                    vehicle.timestamp = parseInt(train.Value);
                                else if (train.Key == 'Vehicle')
                                    vehicle.id = train.Value;
                                else if (train.Key == 'Latitude')
                                    vehicle.latitude = train.Value;
                                else if (train.Key == 'Longitude')
                                    vehicle.longitude = train.Value;
                            });
                            console.log('adding train' + JSON.stringify(vehicle))
                            train_info.push(vehicle);
                        }
                    });
                    console.log('full train length:' + train_info.length);
                    cb(train_info);
                }
        });
}