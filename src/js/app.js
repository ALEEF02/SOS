Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL('https://rawgit.com/ALEEF02/sosConfig/master/config/config.html');
  console.log("Config opened");
  //Show config page
});

var firstName = localStorage.getItem('name') || 'None';
var goal = localStorage.getItem('goal') || 64;
var UI = require('ui');
var Vector2 = require('vector2');
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
  goal = payload.wGoal;
  //Set secret key and name then log name
  
  console.log(firstName);
  console.log(goal + " is goal");
  
  localStorage.setItem('key', secret_key);
  localStorage.setItem('goal', goal);
  if (firstName !== "" || firstName !== "None") { 
    localStorage.setItem('name', firstName);
  }
  restart.show();
  //Set key in the memory of the watch and show restart card
});

var xhttp = new XMLHttpRequest();
var secret_key = localStorage.getItem('key') || 'No Key';
//Get UI and set key from memory
var water = localStorage.getItem('water') || 0;
var adding = 0;
var date = new Date();
var today = (date.getMonth() + "/" + date.getDate() + "/"+ date.getFullYear());
var loggedDate = localStorage.getItem('date') || (date.getMonth() + "/" + date.getDate() + "/"+ date.getFullYear());
if (today !== loggedDate) {
  water = 0;
  localStorage.setItem('water', water);
  console.log("Different day... Current: " + today + "  Logged: " + loggedDate);
  localStorage.setItem('date', today);
} else {
  console.log("Same day... Current: " + today + "  Logged: " + loggedDate);
  localStorage.setItem('date', loggedDate);
}
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
  title: 'Welcome!',
  body: 'Press up to use the water counter and press select to send an SOS'
});

var no_pos = new UI.Card({
  title: 'No GPS!',
  body: 'No GPS signal has been detected. Click up to try to find GPS and send, down to send without GPS or back to cancel'
});

var waterWin = new UI.Window({});
waterWin.status(false);

var background = new UI.Rect({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    backgroundColor: 'white'
  });

var cup = new UI.Rect({
  position: new Vector2(40, 80),
  size: new Vector2(64, 85),
  borderColor: 'black'
});

var sidebar = new UI.Rect({
  position: new Vector2(128, 20),
  size: new Vector2(18, 120),
  backgroundColor: 'black'
});

var add = new UI.Image({
  position: new Vector2(129, 33),
  size: new Vector2(16, 16),
  backgroundColor: 'clear',
  image: 'images/Plus.png',
});

var subtract = new UI.Image({
  position: new Vector2(129, 117),
  size: new Vector2(16, 16),
  backgroundColor: 'clear',
  image: 'images/minus.png',
});

var submit = new UI.Image({
  position: new Vector2(130, 75),
  size: new Vector2(16, 16),
  backgroundColor: 'clear',
  image: 'images/enter.png',
});

var currentLabel = new UI.Text({
    position: new Vector2(5, 5),
    size: new Vector2(144, 30),
    font: 'gothic_14_bold',
    text: 'Current water:',
    color: 'black',
    textAlign: 'left'
  });

var currentWater = new UI.Text({
    position: new Vector2(98, 5),
    size: new Vector2(144, 30),
    font: 'gothic_14_bold',
    text: water + ' OZ',
    color: 'black',
    textAlign: 'left'
  });

var goalLabel = new UI.Text({
    position: new Vector2(5, 15),
    size: new Vector2(144, 30),
    font: 'gothic_14_bold',
    text: 'Current goal:',
    color: 'black',
    textAlign: 'left'
  });

var goalOs = new UI.Text({
    position: new Vector2(85, 15),
    size: new Vector2(30, 30),
    font: 'gothic_14_bold',
    text: goal + ' OZ',
    color: 'black',
    textAlign: 'right'
  });
waterWin.add(background);
waterWin.add(cup);
waterWin.add(sidebar);
waterWin.add(add);
waterWin.add(submit);
waterWin.add(subtract);
waterWin.add(currentLabel);
waterWin.add(currentWater);
waterWin.add(goalOs);
waterWin.add(goalLabel);
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

main.on('click', 'up', function(e) {
  //When up button in main UI clicked..
  waterWin.show();
});

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