var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console
var https = require('https');
var API_ENDPOINT = 'http://iotdoorbell.herokuapp.com/api/v1';

//PIN CLASS
function Pin(pin, direction, value) {
    if(pin === undefined)
        pin = 13;
    if(direction === undefined)
        direction = mraa.DIR_OUT;
    if(value === undefined)
        value = 1;
            
    this.pin = pin;
    this.dir = direction;
    this.state = value;
    console.log("Try pin "+pin+", dir "+direction+", val "+value);
    this.hw = new mraa.Gpio(pin, false, false);
    this.hw.dir(direction);
    if(this.dir == PINMANAGER.OUTPUT)
        this.hw.write(this.state);
    
    if(this.dir == PINMANAGER.PWM) {
        this.hw = new mraa.Pwm(pin, false, -1);
        this.hw.enable(true);     
    }
    
    this.getPin = function() {
        return this.pin;   
    }
    this.getDirection = function() {
        return this.dir;   
    }
    this.getState = function() {
        return this.state;   
    }
    this.getValue = this.getState;
    this.getHardwarePin = function() {
        return this.hw;   
    }
    this.write = function(data) {
        if(this.getDirection !== PINMANAGER.INPUT) {
            this.setState(data);
            this.hw.write(this.state);   
        }
        return this.getState();
    }
    this.read = function() {
        if(this.getDirection !== PINMANAGER.OUTPUT) {
            this.setState(this.hw.read());   
        }
        return this.getState();
    }
    this.setState = function(state) {
        this.state = state;
        return this;
    }
    this.setValue = this.setState;
    this.setEnable = function(b) {
        this.hw.enable(b);
    }
}

PINMANAGER = {OUTPUT: mraa.DIR_OUT, INPUT: mraa.DIR_IN, PWM: 7};
//PIN MANAGER CLASS
function PinManager() {
    this.pinObject = {};
    this.addNewPin = function(name, pin) {
        this.pinObject[name] = pin;
    }
    this.get = function(pinName) {
        return this.pinObject[pinName];
    }
    this.getNames = function() {
        var temp = [];
        for(i in this.pinObject) {
            temp.push(i);
        }
        return temp;
    }
    this.list = function() {
        return this.pinObject;   
    }
}

//GLOBAL PIN MANAGER
pins = new PinManager();

pins.addNewPin("yellow", new Pin(5, PINMANAGER.PWM, 1));
pins.addNewPin("green", new Pin(3, PINMANAGER.PWM, 0.5));
pins.addNewPin("doorbell", new Pin(8, PINMANAGER.INPUT, 0));
pins.get("yellow").write(1);
pins.get("green").write(1);
var cycling_dir_y = -1;
var cycling_dir_g = -1;
var button_pressed = false;
var STATES = {IDLE: 0, CYCLING: 1, USER_BUSY: 2, USER_AVAILABLE: 3, USER_OPEN: 4};
var state = STATES.IDLE;
var eventId; //This is the id of the doorbell ring
setInterval(function() {
    switch(state) {
        case STATES.IDLE:
            var y = pins.get("yellow");
            var g = pins.get("green");
            y.write(0.1);
            g.write(0.1);

            //Check button
            if(pins.get("doorbell").read() == 1 && !button_pressed) {
                button_pressed = true;
            } else if(pins.get("doorbell").read() == 0 && button_pressed) {
                button_pressed = false;
                //DO STUFF HUR
                console.log("Button released");
                state = STATES.CYCLING;
                ringDoorbell();
            }
            break;
        case STATES.CYCLING:       
            var y = pins.get("yellow");
            var g = pins.get("green");
            y.write(y.getValue()+cycling_dir_y*0.01);
            if(y.getValue() >= 1 || y.getValue() <= 0)
                cycling_dir_y *= -1;
            g.write(g.getValue()+cycling_dir_g*0.01);
            if(g.getValue() >= 1 || g.getValue() <= 0)
                cycling_dir_g *= -1;
            
            //Check button to possibly cancel teh call
            if(pins.get("doorbell").read() == 1 && !button_pressed) {
                button_pressed = true;
            } else if(pins.get("doorbell").read() == 0 && button_pressed) {
                button_pressed = false;
                //DO STUFF HUR
                console.log("Button released");
                state = STATES.IDLE;
            }
            break;
        case STATES.USER_AVAILABLE:
            var y = pins.get("yellow");
            y.write(0);
            var g = pins.get("green");
            g.write(g.getValue()+cycling_dir_g*0.01);
            if(g.getValue() >= 1 || g.getValue() <= 0)
                cycling_dir_g *= -1;
            //Check button to possibly cancel teh call
            if(pins.get("doorbell").read() == 1 && !button_pressed) {
                button_pressed = true;
            } else if(pins.get("doorbell").read() == 0 && button_pressed) {
                button_pressed = false;
                //DO STUFF HUR
                console.log("Button released");
                state = STATES.IDLE;
            }
            break;
        case STATES.USER_OPEN:
            var y = pins.get("yellow");
            y.write(0);
            var g = pins.get("green");
            g.write(1);
            //Check button to possibly cancel teh call
            if(pins.get("doorbell").read() == 1 && !button_pressed) {
                button_pressed = true;
            } else if(pins.get("doorbell").read() == 0 && button_pressed) {
                button_pressed = false;
                //DO STUFF HUR
                console.log("Button released");
                state = STATES.IDLE;
            }
            break;
        case STATES.USER_BUSY:
            var g = pins.get("green");
            g.write(0);
            var y = pins.get("yellow");
            y.write(1);
            //Check button to possibly cancel teh call
            if(pins.get("doorbell").read() == 1 && !button_pressed) {
                button_pressed = true;
            } else if(pins.get("doorbell").read() == 0 && button_pressed) {
                button_pressed = false;
                //DO STUFF HUR
                console.log("Button released");
                state = STATES.IDLE;
            }
            break;
    }
}, 10);
/**
    JSON RESPONSE
    ?event: event id
    {result: 2,3,4, time: ms of request}
**/ 
setInterval(function() {
    if(state == STATES.CYCLING) {
        //Ping the server once/second until there is a response to the current request   
        https.get(ENDPOINT+"/event?event="+eventId, function(res) {
            res.on('data', function(d) {
                var r = JSON.parse(d);
                if(r.result == STATES.USER_AVAILABLE) 
                    state = STATES.USER_AVAILABLE;
                else if(r.result == STATES.USER_BUSY)
                    state = STATES.USER_BUSY;
                else if(r.result == STATES.USER_OPEN)
                    state = STATES.USER_OPEN;
            });
        }).on('error', function(e) {
          console.log("Got error: " + e.message);
        });
    }
}, 1000);

//This function is called when a doorbell is rung. It pings the server to get a request id.
function ringDoorbell() {
    https.get(ENDPOINT+"/new", function(res) {
        res.on('data', function(d) {
            r = JSON.parse(d); 
            eventId = d.event_id;
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}
               