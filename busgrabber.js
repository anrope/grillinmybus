var libxmljs = require("libxmljs");
var request = require('request');


function VehicleLog() {
    this.id=null;
    this.longitude=null;
    this.latitude=null;
    this.timestamp=null;
}

function getBus(agency_tag, route_tag, time)
{
        var bus_info = [];
        var start = new Date().getTime();
        
        //make request for bus info
        request('http://webservices.nextbus.com/service/publicXMLFeed?' +
            'command=vehicleLocations&a=' + agency_tag + '&r=' + route_tag  + '&t=' + time,
            function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('success' + body);
            var xmlDoc = libxmljs.parseXmlString(body);
            var logs = xmlDoc.get('//body').childNodes();
            console.log('length of logs:' + logs.length);
            logs.forEach(function(log) {
                if(log != null && log.attr('lon')) {
                    var vehicle = new VehicleLog();
                    vehicle.timestamp = start + parseInt(log.attr('secsSinceReport').value());
                    vehicle.longitude = log.attr('lon').value();
                    vehicle.latitude = log.attr('lat').value();
                    vehicle.id = log.attr('id').value();
                    console.log('vehicle:' + vehicle.id + 'timestamp:' + vehicle.timestamp);
                    bus_info.push(JSON.stringify(vehicle));
                    console.log('added to bus length' + bus_info.length);
                }
            });
        console.log('full bus length:' + bus_info.length);
        return bus_info;
        }
        });

}