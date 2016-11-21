const five = require('johnny-five');
const board = new five.Board();

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

  // return all three temperature scales
  return {
    tempK: tempK,
    tempC: tempC,
    tempF: tempF
  };
}

const THMPIN = 'A0';

board.on('ready', () => {
  const thm = new five.Sensor({ pin: THMPIN, freq: 500 });
  let currentTemp = {};

  thm.on('change',  (voltage) => {
    currentTemp = convertVoltToTemp(voltage);

    console.log(currentTemp);
  });
});