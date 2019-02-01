var sendNotification = function(data) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic YmVjYWFmNDEtN2Q0Yy00YzI0LTljN2EtZWU1Y2UzOWU2ZDVh"
  };
  
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  
  var https = require('https');
  var req = https.request(options, function(res) {  
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });
  
  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });
  
  req.write(JSON.stringify(data));
  req.end();
};

var message = { 
  headings: {"en": "WHManagement Notif"},
  app_id: "004a1e03-c0d9-49e4-8544-bc65056c67ff",
  contents: {"en": "Testing Notif"},
  included_segments: ["All"]
};

sendNotification(message);