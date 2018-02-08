Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL('https://rawgit.com/ALEEF02/sosConfig/master/config/config.html');
  //Show config page
});

Pebble.addEventListener('webviewclosed', function(e) {
  //On config submitted
  var payload = JSON.parse(e.response);
  //Take config input and parse with JSON

  var secret_key = payload.s_key;
  //Set secret key and log it
  
  console.log(secret_key);
  
  localStorage.setItem('key', secret_key);
  //Set key in the memory of the watch
});

var xhttp = new XMLHttpRequest();
var secret_key = localStorage.getItem('key') || 'No Key';
var UI = require('ui');
//Get UI and set key from memory
var latitude = 0.00000;
var longitude = 0.00000;
//Set base lat and long
function success(pos) {
  latitude = pos.coords.latitude;
  longitude = pos.coords.longitude;
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
}

function error(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

var options = {
  enableHighAccuracy: true,
  maximumAge: 10000,
  timeout: 10000
};

//Define functions for Location handling

var main = new UI.Card({
  title: 'Send SOS',
  subtitle: 'Press select to send an SOS'
});

var no_pos = new UI.Card({
  title: 'No GPS!',
  body: 'No GPS signal has been detected. Click up to try to find GPS and send, down to send without GPS or back to cancel'
});

main.show();
navigator.geolocation.getCurrentPosition(success, error, options);
function sendSOS() {
  var trigger_data = {};
  trigger_data.value1 = latitude;
  trigger_data.value2 = longitude;
  console.log(trigger_data + " raw data");
  console.log(JSON.stringify(trigger_data) + " JSON data");
  xhttp.open("POST", "https://maker.ifttt.com/trigger/sos/with/key/" + secret_key + "?value1=" + latitude + "&value2=" + longitude, true);
  xhttp.send(JSON.stringify(trigger_data));
  xhttp.onload = function(){
    console.log('Got response: ' + this.responseText);
  };
  var sent = new UI.Card({
    title: 'Sent',
    body: 'Recipient should recieve message shortly'
  });
  sent.show();
}
//Define main interface, call it, and gather location

main.on('click', 'select', function(e) {
  if (secret_key == 'No Key') {
    var no_key = new UI.Card({
      title: 'Error!',
      body: 'You have not put in your secret key. Go to the settings to do so'
    });
    no_key.show();
  } else if (longitude == 0) {
    console.log("No GPS");
    no_pos.show();
  } else {
    sendSOS();
  }
});
no_pos.on('click', 'up', function(e) {
  no_pos.body = 'Updating... 1 moment';
  navigator.geolocation.getCurrentPosition(success, error, options);
  setTimeout(function(){
    if (longitude == 0) {
      no_pos.body = 'STILL no GPS signal detected. Click up to try to find GPS and send, down to send without GPS or back to cancel';
    } else {
      sendSOS();
    }
  }, 2000);
});
no_pos.on('click', 'down', function(e) {
  sendSOS();
});