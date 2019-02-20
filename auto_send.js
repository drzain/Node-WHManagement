var EventEmitter = require('events');
var util = require('util');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var uuidv4 = require('uuid/v4');
var urlencode = require('urlencode');
// require(process.cwd() + '/database');
var MySQL = require('mysql');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

function MyEmitter() {

	EventEmitter.call(this);

}

util.inherits(MyEmitter, EventEmitter);

var DB1 = MySQL.createPool(
{
	connectionLimit : 32,
	host            : '172.16.31.199',
	user            : 'crontab',
	password        : 'remotecrontab',
	database        : 'db_sms_api'
});

MyEmitter.prototype.sending = function sending() {

	DB1.query("SELECT uniqueid,cabang, kodecabang, customer, flag FROM tblSample WHERE state = 'N' LIMIT 1", 
  	function (err, result, fields) {
	   	if (err){
			throw err;
			//console.log("Data not found");
		} else {
			var str = JSON.stringify(result);
      		var rows = JSON.parse(str);
      		//console.log(rows.length);
      		//console.log(rows);
			console.log(str);

			if(rows.length == '1'){

				  for(var i = 0; i < rows.length; i++){
	      			var str2 = JSON.stringify(result[i]);
		 			var data = JSON.parse(str2);
		 			var uniqueid = data.uniqueid;
		 			var cabang = data.cabang;
		 			var kode = data.kodecabang;
		 			var name = data.customer;
	      		  }

	      		  var konten = "Ada data baru, silakan check aplikasi";

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

				      	DB1.query("UPDATE tblSample SET flag = 'Y' WHERE state = 'N' AND uniqueid = ".uniqueid."", 
  						function (err, result, fields) {

  							if (err){
								throw err;
								console.log(err);
							} else {
								console.log('updated');
							}

  						});

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
				  headings: {"en": "SIP Warehouse"},
				  app_id: "004a1e03-c0d9-49e4-8544-bc65056c67ff",
				  contents: {"en": konten},
				  android_sound: "notification",
				  android_visibility: 1,
				  included_segments: ["All"]
				};

				sendNotification(message);
			}else{
				var o = [] // empty Object
				var data = {
				    desc: 'Data not Found'
				};
				o.push(data);
				var message = JSON.stringify(o);
				console.log(message);
			}
		}

	});
	
	this.emit('kirim');	

}
 
//} 
//requestcall();
var notif = new MyEmitter();

notif.on('kirim', function() {
	//console.log('Calling...');
	setTimeout(function(){ 
		notif.sending(); 
	
	}, 300)
});

notif.sending();
