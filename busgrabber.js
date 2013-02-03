var libxmljs = require("libxmljs");
var request = require('request');


function VehicleLog() {
    this.id=null;
    this.longitude=null;
    this.latitude=null;
    this.timestamp=null;
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
                        var vehicle = new VehicleLog();
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
                        var train = new VehicleLog();
                        train_log.forEach(function(train) {
                            console.log(train);
                            if (train.Key == 'TimeStamp')
                                vehicle.timestamp = parseInt(train.Key);
                            else if (train.Key == 'Vehicle')
                                vehicle.id = train.Vehicle;
                            else if (train.Key == 'Latitude')
                                vehicle.latitude = train.Latitude;
                            else if (train.Key == 'Longitude')
                                vehicle.longitue = train.Longitude;
                        });
                        bus_info.push(vehicle);
                    }
                });
                console.log('full bus length:' + bus_info.length);
                cb(bus_info);
        }
        });
}