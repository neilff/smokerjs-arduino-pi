const five = require('johnny-five');
const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const board = new five.Board();

const PORT = process.env.PORT || 3000;

let currentTemp = {};

function convertVoltToTemp(volt) {
  let tempK = 0;
  let tempC = 0;
  let tempF = 0;

  // get the Kelvin temperature
  tempK = Math.log(((10240000 / volt) - 10000));
  tempK = 1 / (0.001129148 + (0.000234125 * tempK) + (0.0000000876741 * tempK * tempK * tempK));

  // convert to Celsius and round to 1 decimal place
  tempC = tempK - 273.15;
  tempC = Math.round(tempC * 10) / 10;

  // get the Fahrenheit temperature, rounded
  tempF = (tempC * 1.8) + 32;
  tempF = Math.round(tempF * 10) / 10;

  return {
    tempK: tempK,
    tempC: tempC,
    tempF: tempF
  };
}

const THMPIN = 'A0';

board.on('ready', () => {
  const thm = new five.Sensor({ pin: THMPIN, freq: 500 });

  thm.on('change',  (voltage) => {
    currentTemp = convertVoltToTemp(voltage);
    console.info('currentTemp', currentTemp);
    io.emit('temperartureUpdate', currentTemp);
  });
});

app.get('/device/lastReading', function (req, res) {
  res.json(currentTemp);
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(PORT, function(){
  console.log(`Listening on port ${ PORT }`);
});
