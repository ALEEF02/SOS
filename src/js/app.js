Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL('https://rawgit.com/ALEEF02/sosConfig/master/config/config.html');
  console.log("Config opened");
  //Show config page
});

var firstName = localStorage.getItem('name') || 'None';
var UI = require('ui');
var restart = new UI.Card({
  title: 'Restart App',
  body: 'Your name and key (hidden) have been registered. Close and open the app to start functionality'
});

Pebble.addEventListener('webviewclosed', function(e) {
  console.log("Config closed");
  //On config submitted
  var payload = JSON.parse(e.response);
  //Take config input and parse with JSON

  var secret_key = payload.s_key;
  var firstName = payload.fName;
  //Set secret key and name then log name
  
  console.log(firstName);
  
  localStorage.setItem('key', secret_key);
  if (firstName !== "" || firstName !== "None") { 
    localStorage.setItem('name', firstName);
  }
  restart.show();
  //Set key in the memory of the watch and show restart card
});

var xhttp = new XMLHttpRequest();
var secret_key = localStorage.getItem('key') || 'No Key';
//Get UI and set key from memory
var latitude = 0.00000;
var longitude = 0.00000;
var response = 'N/A';
var updating = false;
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
//Define and show main interface
navigator.geolocation.getCurrentPosition(success, error, options);
//Find current lat and long

function sendSOS() {
  var trigger_data = {};
  trigger_data.value1 = latitude;
  trigger_data.value2 = longitude;
  //Create object and set the lat and long
  if (firstName == 'None') {
    xhttp.open("POST", "https://maker.ifttt.com/trigger/sos/with/key/" + secret_key + "?value1=" + latitude + "&value2=" + longitude + "&value3=User", true);
  } else {
    xhttp.open("POST", "https://maker.ifttt.com/trigger/sos/with/key/" + secret_key + "?value1=" + latitude + "&value2=" + longitude + "&value3=" + firstName, true);
  }
  xhttp.send(JSON.stringify(trigger_data));
  //Open and send a POST request to the MAKER API with the provided key, latitude, and longitude
  xhttp.onload = function(){
    console.log('Got response: ' + this.responseText);
    response = this.responseText;
  };
  //Sets reponse to API response 
  var sent = new UI.Card({
    title: 'Sent',
    body: 'Recipient should recieve message shortly. Response from API: ' + response
  });
  sent.show();
  updating = false;
  //Define and show the sent card
}

main.on('click', 'select', function(e) {
  //When middle button in main UI clicked..
  if (secret_key == 'No Key') {
    var no_key = new UI.Card({
      title: 'Error!',
      body: 'You have not put in your secret key. Go to the settings to do so'
    });
    no_key.show();
    //Checks for a key
  } else if (longitude == 0) {
    console.log("No GPS");
    no_pos.show();
    //Checks for lat and long, if none show error
  } else {
    updating = true;
    sendSOS();
    //Sends SOS using a function defined earlier
  }
});

no_pos.on('click', 'up', function(e) {
  if (updating === false) {
    updating = true;
    //When up button in GPS error UI clicked..
    no_pos.body = 'Updating... 1 moment';
    options = {
      enableHighAccuracy: false,
      maximumAge: 10000,
      timeout: 10000
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
    //Change card body and try to get GPS again with lower accuracy
    setTimeout(function(){
      //Wait 3 seconds for GPS and check
      if (longitude == 0) {
        no_pos.body = 'STILL no GPS signal detected. Click up to try to find GPS and send, down to send without GPS or back to cancel';
        //If none, change body again
      } else {
        no_pos.hide();
        sendSOS();
        //If found, run SOS
      }
    }, 3000);
    updating = false;
  }
});

no_pos.on('click', 'down', function(e) {
  if (updating === false) {
    updating = true;
    //Run w/o GPS
    no_pos.hide();
    sendSOS();
  }
});