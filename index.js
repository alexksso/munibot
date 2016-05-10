
function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function build_alexa_response(stops){


  var s = Object.keys(stops).sort(function(a,b){
    return Number(stops[a].time)- Number(stops[b].time);
  });
  var r = "";
  for(var i of s){
    r += stops[i].time+" minutes from "+stops[i].name+ ", "
  }
  r = r.slice(0, -2);
  r += ".";

  var alexa= {
    version: "1.0", 
    response: {
      outputSpeech: {
        type: "PlainText",
        text: r
      }, 
      card:{
        content: r,
        title: "Next muni rides",
        type: "Simple"
      }, 
      shouldEndSession: true 
    }, 
    sessionAttributes: {} 
  }

  return alexa;

}


var get_muni = function(request, response) {
  var stops = {16086: null, 14168: null};
  var url="http://services.my511.org/Transit2.0/GetNextDeparturesByStopCode.aspx?token=c1637962-ea6e-456f-8002-5ca4186b7829&stopCode=";
  var busnr = "37";

  for(var i of Object.keys(stops)){
      var stopnr = i;
      var r = url + stopnr;
      console.log(r);
      wwwrequest(r, function (error, resp, body) {
        console.log(body);
          parseString(body, function (err, result) {
            var stopname = result.RTT.AgencyList[0].Agency[0].RouteList[0].Route[0].RouteDirectionList[0].RouteDirection[0].StopList[0].Stop[0].$.name;
            var stopcode= result.RTT.AgencyList[0].Agency[0].RouteList[0].Route[0].RouteDirectionList[0].RouteDirection[0].StopList[0].Stop[0].$.StopCode;

            var leavetime = result.RTT.AgencyList[0].Agency[0].RouteList[0].Route[0].RouteDirectionList[0].RouteDirection[0].StopList[0].Stop[0].DepartureTimeList[0].DepartureTime[0];
            stops[stopcode] = {name: stopname, time: leavetime};
            console.log(stops);
            if (!contains(Object.keys(stops).map(function(e){return stops[e];}), null)){
              //response.render('pages/index', {alexa_response: build_alexa_response(stops)});
              response.end(
                JSON.stringify(build_alexa_response(stops))
                );
            }
          });
      });
    }
}

var express = require('express');
var app = express();
var wwwrequest = require('request');
var parseString = require('xml2js').parseString;


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.post('/', get_muni);
app.get('/', get_muni);


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


