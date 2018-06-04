Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL('https://rawgit.com/ALEEF02/sosConfig/master/config/config.html');
  console.log("Config opened");
  //Show config page
});

var firstName = localStorage.getItem('name') || 'None';
var goal = localStorage.getItem('goal') || 64;
var UI = require('ui');
var Settings = require('settings');
var timeline = require('timeline');
var Wakeup = require('wakeup');
var timeline2 = require('./timeline2');
var Voice = require('ui/voice');
var Vibe = require('ui/vibe');
var Vector2 = require('vector2');
var date = new Date();
var restart = new UI.Card({
  title: 'Restart App',
  body: 'Your settings have been recorded. Close and open the app to start functionality'
});
var pinNot = new UI.Card({
  title: 'Daily Pin',
  body: 'Sorry to bother, just pushing a pin. Please close this'
});
var missedWake = new UI.Card({
  title: 'Daily Pin',
  body: "It seems your watch was off at the time off the wakeup. Tommorow's pins was just pushed."
});
var pins = localStorage.getItem('pins') || "No";
var wakeTime = localStorage.getItem('wakeTime') || date.getTime();
//Define some UI libraries

function pushPins() {
  //define various variables
  var dateObject;
  var date2Object;
  var pinTime;
  var remindTime;
  var pinTimeObject;
  var remindTimeObject;
  var todayD;
  var tomD;
  var pin;
  var wakeTimeObject;
  var wakeObject;
  var id;
  
  //Set today's and tommorows date using 0-11 and 0-30
  todayD = ((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
  if (date.getMonth() === 0 || date.getMonth() == 2 || date.getMonth() == 4 || date.getMonth() == 6 || date.getMonth() == 7 || date.getMonth() == 9 || date.getMonth() == 11) {
    if (date.getDate() == 31) {
      if (date.getMonth() == 11) {
        tomD = (0 + '/' + 1 + '/' + (date.getFullYear() + 1));
      } else {
        tomD = ((date.getMonth() + 2) + '/' + 1 + '/' + date.getFullYear());
      }
    } else {
      tomD = ((date.getMonth() + 1) + '/' + (date.getDate() + 1) + '/' + date.getFullYear());
    }    
  } else if (date.getMonth() == 3 || date.getMonth() == 5 || date.getMonth() == 8 || date.getMonth() == 10) {
    if (date.getDate() == 30) {
      tomD = ((date.getMonth() + 2) + '/' + 1 + '/' + date.getFullYear());
    } else {
      tomD = ((date.getMonth() + 1) + '/' + (date.getDate() + 1) + '/' + date.getFullYear());
    }    
  } else if (date.getMonth() == 1) {
    if (date.getDate() == 28) {
      tomD = ((date.getMonth() + 2) + '/' + 1 + '/' + date.getFullYear());
    } else {
      tomD = ((date.getMonth() + 1) + '/' + (date.getDate() + 1) + '/' + date.getFullYear());
    }
  } else {
    console.log("ERROR: Month not defined");
  }
  
  //Calculates Tommorow
  console.log("Today is " + todayD);
  console.log("tommorow is " + tomD);
  dateObject = new Date(tomD);
  console.log("tommorow in object form: " + dateObject.toISOString());
  date2Object = new Date(tomD);
  wakeObject = new Date(tomD);
  pinTime = "";
  remindTime = "";
  pinTimeObject = new Date();
  //Sets hours and minutes for wake up and pin
  remindTimeObject = new Date();
  wakeTimeObject = new Date();
  pinTimeObject.setHours(09);
  pinTimeObject.setMinutes(00);
  pinTimeObject.setSeconds(00);
  remindTimeObject.setHours(09);
  remindTimeObject.setMinutes(00);
  remindTimeObject.setSeconds(00);
  wakeTimeObject.setHours(09);
  wakeTimeObject.setMinutes(01);
  wakeTimeObject.setSeconds(00);
  id = (dateObject.getMonth() + "_" + dateObject.getDate() + "_" + dateObject.getFullYear());
  wakeObject.setHours(wakeTimeObject.getHours(), wakeTimeObject.getMinutes(), wakeTimeObject.getSeconds());
  console.log("Pin hours, minutes, and seconds: " + pinTimeObject.getHours(), pinTimeObject.getMinutes(), pinTimeObject.getSeconds());
  dateObject.setHours(pinTimeObject.getHours(), pinTimeObject.getMinutes(), pinTimeObject.getSeconds());
  console.log("tommorow in object form with time: " + dateObject.toISOString());
  date2Object.setHours(remindTimeObject.getHours(), remindTimeObject.getMinutes(), remindTimeObject.getSeconds());
  console.log("Wake up hours, minutes, and seconds: " + wakeObject.getHours(), wakeObject.getMinutes(), wakeObject.getSeconds() + " FULL: " + wakeObject.toISOString());
  //Creates date objects for wakeup time, pin time, and reminder time
  
  //Reschedual wake up
  Wakeup.each(function(e) {
    console.log('Before cancel wakeup ' + e.id + ': ' + JSON.stringify(e));
  });
  Wakeup.cancel('all');
  Wakeup.schedule({
    time: wakeObject,
    notifyIfMissed: true,
    // Pass data for the app on launch
    data: { reason: 'pins' }
  },
  function(e) {
    if (e.failed) {
      // Log the error reason
      console.log('Wakeup set failed: ' + e.error);
    } else {
      console.log('Wakeup set! Event ID: ' + e.id);
    }
  });
  localStorage.setItem('wakeTime', wakeObject.getTime());
  console.log("Wake time in MS from jan 1 1970: " + wakeObject.getTime());
  //Scheduals the wakeup
  
  pin = {
    "id": id + "_Water",
    "time": dateObject.toISOString(),
    "duration": undefined,
    "layout": {
      "type": 'genericPin',
      "title": 'Water Goal',
      "locationName": undefined,
      "body": 'Try to hit your daily goal of ' + goal + ' oz today, ' + firstName + '!',
      "tinyIcon": "system://images/GENERIC_CONFIRMATION",
      "primaryColor": 'black',
      "secondaryColor": 'black',
      "backgroundColor": 'CobaltBlue'
    },
    "reminders": [{
      "time": date2Object.toISOString(),
      "layout": {
        "type": "genericReminder",
        "tinyIcon": "system://images/GENERIC_CONFIRMATION",
        "title": 'Water Goal',
        "body": 'Try to hit your daily goal of ' + goal + ' oz today, ' + firstName + '!'
      }
    }],
    "actions": [{
      "title": "View today's water",
      "type": "openWatchApp",
      "launchCode": 2
    }]
  };
  //Creates the pin
    timeline2.deleteUserPin(pin, function(responseText) {
      console.log('Result on deleting pin: ' + responseText);
    });
  
    timeline2.insertUserPin(pin, function(responseText) {
      console.log('Result on pushing pin: ' + responseText);
      Vibe.vibrate('short');
    });
  //Pushes the pin
}

function subscribe() {
  Pebble.timelineSubscribe('all-pins', function() {
    console.log('Successfully subscribed to pins');
  }, function(error) {
    console.log('Failed to subscribe to pins! Error: ' + error);
  });
  //Subscribe to pins
}

Pebble.addEventListener('webviewclosed', function(e) {
  console.log("Config closed");
  //On config submitted
  var payload = JSON.parse(e.response);
  //Take config input and parse with JSON
  var secret_key = localStorage.getItem('key') || 'No Key';
  var firstName = payload.fName;
  
  if (payload.s_key != "") {
    secret_key = payload.s_key;
    console.log("Setting key");
    console.log("Key is: " + secret_key.substring(0,8) + "...");
  } else {
    console.log("Not setting key");
  }
  
  pins = payload.pushPins;
  goal = payload.wGoal;
  //Set secret key and name then log name
  
  console.log(firstName + " is the name");
  console.log(pins + " to pins");
  console.log(goal + " is goal");
  
  localStorage.setItem('pins', pins);
  localStorage.setItem('key', secret_key);
  localStorage.setItem('goal', goal);
  
  if (firstName !== "" && firstName !== "None") {
    localStorage.setItem('name', firstName);
    console.log("Name set");
  } else {
    console.log("Keeping current name");
  }
  
  restart.show();
  //Set key in the memory of the watch and show restart card
  if (pins == "Yes") {
    subscribe();
    console.log("Delaying pins for 2s");
    setTimeout(function() {
      console.log("Starting push");
      pushPins();  
    }, 2000);
  } else {
    Vibe.vibrate('short');
  }
});

var xhttp = new XMLHttpRequest();
var secret_key = localStorage.getItem('key') || 'No Key';
//Get UI and set key from memory
var water = localStorage.getItem('water') || 0;
water = Number(water);
var change = 4;
var adding = 0;
var cupValue = 0;
//var notes = localStorage.getItem('notes') || [{title: 'Add Note'}];
var notes = Settings.option('storedNotes') || [{title: 'Add Note'}];
//var notes = [{title: 'Add Note'}];
var today = (date.getMonth() + "/" + date.getDate() + "/"+ date.getFullYear());
var loggedDate = localStorage.getItem('date') || (date.getMonth() + "/" + date.getDate() + "/"+ date.getFullYear());
var currTime = date.getTime();
console.log("Notes: ");
console.log(JSON.stringify(notes, null, 4));
console.log("Logged wake time: " + wakeTime);
if (today !== loggedDate) {
  water = 0;
  localStorage.setItem('water', water);
  console.log("Different day... Current: " + today + "  Logged: " + loggedDate);
  localStorage.setItem('date', today);
} else {
  console.log("Same day... Current: " + today + "  Logged: " + loggedDate);
}
//If it's not the same day, reset the daily water counter
var latitude = 0.00000;
var longitude = 0.00000;
var updating = false;
//Set base lat and long
function success(pos) {
  latitude = pos.coords.latitude;
  longitude = pos.coords.longitude;
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  //set latitude and longitude
}

function error(err) {
  console.log('location error (' + err.code + '): ' + err.message);
  //log any location-related error
}

var options = {
  enableHighAccuracy: true,
  maximumAge: 10000,
  timeout: 10000
};

//Define functions for Location handling

var main = new UI.Card({
  title: 'Welcome!',
  body: 'Press up to use the water counter, press select to send an SOS, or press down for notes'
});
var noteMenu = new UI.Menu({
  highlightBackgroundColor: 'blue',
  sections: [{
    title: 'Notes',
    items: notes
  }]
});
var confirm = new UI.Card({
  title: 'Please confirm!',
  body: 'Long click select to send your SOS, else hit back'
});
var no_pos = new UI.Card({
  title: 'No GPS!',
  body: 'No GPS signal has been detected. Click up to try to find GPS and send, down to send without GPS or back to cancel'
});
var waterWin = new UI.Window({});
waterWin.status(false);
var selectedIndex;
var selectedTitle;
//Define main and sub interfaces

var background = new UI.Rect({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    backgroundColor: 'white'
  });
var cup = new UI.Rect({
  position: new Vector2(35, 80),
  size: new Vector2(74, 85),
  borderColor: 'black'
});

if (water > goal) {
  cupValue = goal;
} else {
  cupValue = water;
}
//If the amt of water is more than goal, set display value to goal so it doesn't overflow

var filling = new UI.Rect({
  position: new Vector2(35, (165 - (85 * (cupValue / goal)))),
  size: new Vector2(74, (85 * (cupValue / goal))),
  borderColor: 'black',
  backgroundColor: 'blue'
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
    position: new Vector2(2, 5),
    size: new Vector2(144, 30),
    font: 'gothic_14_bold',
    text: 'Current water:',
    color: 'black',
    textAlign: 'left'
});
var currentWater = new UI.Text({
    position: new Vector2(88, 5),
    size: new Vector2(39, 30),
    font: 'gothic_14_bold',
    text: water + ' OZ',
    color: 'black',
    textAlign: 'right'
});
var goalLabel = new UI.Text({
    position: new Vector2(2, 20),
    size: new Vector2(144, 30),
    font: 'gothic_14_bold',
    text: 'Current goal:',
    color: 'black',
    textAlign: 'left'
});
var goalOs = new UI.Text({
    position: new Vector2(87, 20),
    size: new Vector2(40, 30),
    font: 'gothic_14_bold',
    text: goal + ' OZ',
    color: 'black',
    textAlign: 'right'
});
var addLabel = new UI.Text({
    position: new Vector2(2, 35),
    size: new Vector2(144, 30),
    font: 'gothic_14_bold',
    text: 'Amount to add:',
    color: 'black',
    textAlign: 'left'
});
var addingOs = new UI.Text({
    position: new Vector2(87, 35),
    size: new Vector2(40, 30),
    font: 'gothic_14_bold',
    text: adding + ' OZ',
    color: 'black',
    textAlign: 'right'
});
var pORm = new UI.Text({
    position: new Vector2(2, 50),
    size: new Vector2(125, 30),
    font: 'gothic_14_bold',
    text: 'Change by ' + change + ' OZ. \nHold + or - to change',
    color: 'black',
    textAlign: 'center'
});
var addingIcon = new UI.Text({
    position: new Vector2(30, (155 - (85 * (cupValue / goal)))),
    size: new Vector2(20, 20),
    font: 'gothic_14_bold',
    text: '>',
    color: 'black',
    textAlign: 'left'
});
var achieveLabel = new UI.Text({
    position: new Vector2(40, 100),
    size: new Vector2(65, 65),
    font: 'gothic_14_bold',
    text: 'Goal Achieved! 🍺🎉😊',
    color: '#FFAA00',
    textAlign: 'center'
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
waterWin.add(addingOs);
waterWin.add(addLabel);
waterWin.add(pORm);
waterWin.add(filling);
waterWin.add(addingIcon);

if (water >= goal) {
  waterWin.add(achieveLabel);
}
//If you reach the goal, display a message
main.show();
//Define and show main interface
navigator.geolocation.getCurrentPosition(success, error, options);
//Find current lat and long

function sendSOS() {
  var IP = new UI.Card({
    title: 'Sending...',
    body: 'One moment'
  });
  IP.show();
  confirm.hide();
  var response = 'N/A';
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
  setTimeout(function(){
    var sent = new UI.Card({
      title: 'Sent',
      body: 'Recipient should recieve message shortly. Response from API: ' + response
    });
    sent.show();
    IP.hide();
    Vibe.vibrate('double');
    updating = false;
    //Define and show the sent card
  }, 3000);
}

function storeNotes() {
  noteMenu.items(0, 0, notes);
  console.log("New notes: " + JSON.stringify(notes, null, 4));
  Settings.option('storedNotes', notes);
  console.log("Reading notes from mem: " + JSON.stringify(Settings.option('storedNotes'), null, 4));
  localStorage.setItem('notes', notes);
  //store the notes in memory
  
  noteMenu.hide();
  setTimeout(function() {
    noteMenu.show();
  }, 200);
}

console.log("Key is: " + secret_key.substring(0,8) + "...");

main.on('click', 'up', function(e) {
  //When up button in main UI clicked..
  waterWin.show();
});

main.on('click', 'select', function(e) {
  //Confirms sending of SOS
  confirm.show();
});

main.on('click', 'down', function(e) {
  //When down button in main UI clicked..
  noteMenu.show();
});

noteMenu.on('select', function(e) {
  selectedTitle = e.item.title;
  selectedIndex = e.itemIndex;
  console.log(selectedTitle + " was selected at index " + selectedIndex);
  //When the select button on the note menu is clicked set the title and index to the selected variables and log it
  if (selectedTitle == "Add Note") {
    //If "Add note" is selected then start the dictation process
    console.log("Adding note");
    Voice.dictate('start', true, function(e) {
      if (e.err) {
        //if an error, log it and abort the adding process
        console.log('Error: ' + e.err);
        return;
      }
      //If successful, log the transcription, add it to the notes and log it
      console.log('Success: ' + e.transcription);
      notes[notes.length] = {title: e.transcription};
      storeNotes();
    });
  } else {
    //If any other note is selected, log it then delete it
    console.log("Deleting note: " + selectedIndex);
    notes.splice(selectedIndex, 1);
    storeNotes();
  }
});

confirm.on('longClick', 'select', function(e) {
  //When middle button in confirm screen UI clicked..
  if (secret_key == 'No Key' || secret_key == "") {
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

waterWin.on('click', 'up', function(e) {
  adding = (adding + change);
  addingOs.text(adding + ' OZ');
  //Set adding amount to the current plus the change variable and display it OS
  if (water > goal) {
    cupValue = goal;
  } else {
    cupValue = water;
  }
  //Prevents overlay of arrow texture on text above cup
  if (((cupValue + adding) / goal) > 1) {
    addingIcon.position(new Vector2(30, 70));
  } else if ((((cupValue + adding) / goal) < 0)) {
    addingIcon.position(new Vector2(30, 155));
  } else {
    addingIcon.position(new Vector2(30, (155 - (85 * ((cupValue + adding) / goal)))));
  }
  //Changes arrow's position
});

waterWin.on('click', 'down', function(e) {
  adding = (adding - change);
  addingOs.text(adding + ' OZ');
  //Set adding amount to the current minus the change variable and display it OS
  if (water > goal) {
    cupValue = goal;
  } else {
    cupValue = water;
  }
  //Prevents overlay of arrow texture on text below cup
  if (((cupValue + adding) / goal) > 1) {
    addingIcon.position(new Vector2(30, 70));
  } else if ((((cupValue + adding) / goal) < 0)) {
    addingIcon.position(new Vector2(30, 155));
  } else {
    addingIcon.position(new Vector2(30, (155 - (85 * ((cupValue + adding) / goal)))));
  }
  //Changes arrow's position
});

waterWin.on('click', 'select', function(e) {
  if (adding > 0) {
    water = (adding + water);
    console.log (water + " current water");
  } else if (adding < 0 && (water + adding) >= 0) {
    water = (adding + water);
    console.log (water + " current water");
  } else if (adding < 0 && (water + adding) < 0) {
    water = 0;
    console.log (water + " current water");
  }
  
  currentWater.text(water + ' OZ');
  localStorage.setItem('water', water);
  
  if (water > goal) {
    cupValue = goal;
  } else {
    cupValue = water;
  }
  
  filling.position(new Vector2(35, (165 - (85 * (cupValue / goal)))));
  filling.size(new Vector2(74, (85 * (cupValue / goal))));
  
  if (((cupValue + adding) / goal) > 1) {
    addingIcon.position(new Vector2(30, 70));
  } else if ((((cupValue + adding) / goal) < 0)) {
    addingIcon.position(new Vector2(30, 155));
  } else {
    addingIcon.position(new Vector2(30, (155 - (85 * ((cupValue + adding) / goal)))));
  }
  
  if (water >= goal) {
    waterWin.add(achieveLabel);
    Vibe.vibrate('double');
  } else {
    waterWin.remove(achieveLabel);
  }
});

waterWin.on('longClick', 'up', function(e) {
  if (change == 2) {
      change = 4;
    } else if (change == 4) {
      change = 8;
    } else if (change == 8) {
      change = 16;
    }
    pORm.text('Change by ' + change + ' OZ. Hold + or - to change');
  //Adds to the amount to increment by and display it OS
});

waterWin.on('longClick', 'select', function(e) {
  //Manually reset all water related variables and OS textures
  water = 0;
  adding = 0;
  change = 4;
  localStorage.setItem('water', water);
  currentWater.text(water + ' OZ');
  addingOs.text(adding + ' OZ');
  pORm.text('Change by ' + change + ' OZ. \nHold + or - to change');
  if (water > goal) {
    cupValue = goal;
  } else {
    cupValue = water;
  }
  filling.position(new Vector2(35, (165 - (85 * (cupValue / goal)))));
  filling.size(new Vector2(74, (85 * (cupValue / goal))));
  if (((cupValue + adding) / goal) > 1) {
    addingIcon.position(new Vector2(30, 70));
  } else if ((((cupValue + adding) / goal) < 0)) {
    addingIcon.position(new Vector2(30, 155));
  } else {
    addingIcon.position(new Vector2(30, (155 - (85 * ((cupValue + adding) / goal)))));
  }
  waterWin.remove(achieveLabel);
});

waterWin.on('longClick', 'down', function(e) {
  if (change == 4) {
      change = 2;
    } else if (change == 8) {
      change = 4;
    } else if (change == 16) {
      change = 8;
    }
    pORm.text('Change by ' + change + ' OZ. Hold + or - to change');
  //Subtracts to the amount to increment by and display it OS
});

timeline.launch(function(e) {
  if (e.launchCode == 2) {
    console.log("Launched from pin!");
    waterWin.show();
  }
  //When launched from timeline, show the water screen
});

Wakeup.launch(function(e) {
  if (e.wakeup) {
    console.log("Launched by wakeup! Pushing pin...");
    pushPins();
    main.hide();
    pinNot.show();
    //When launched by wakeup push the daily pins and display a message
  } else {
    console.log("Not launched by wakeup. Checking wakeup");
    if (wakeTime < currTime) {
      console.log("Missed wakeup by " + (currTime - wakeTime) + " MS");
      if (pins == "Yes") {
        console.log("Pins are on! Rescheduling wakeup and pushing pins");
        pushPins();
        missedWake.show();
      } else {
        console.log("Pins are set to off. Choosing not to send");
      }
    } else {
      console.log("Wake up ahead by " + (wakeTime - currTime) + " MS");
    }
    //If the wakeup was missed, reschedule the wakeup and push the daily pin
  }
});