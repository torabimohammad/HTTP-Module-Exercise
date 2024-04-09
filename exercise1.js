'use strict';

const request = require('http'); 
const devices = 10;

function fetchSensorValue(sensorId, callback) {
    const options = { port: 8080, path: `/?id=${sensorId}` };
    const req = request.request(options, res => {
        let chunks = [];
        res.setEncoding('utf8');
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(chunks);
                callback(null, parsedData.value);
            } catch (e) {
                console.error(`problem with request: ${e.message}`);
                callback(e);
            }
        });
    });

    req.on('error', error => {
        console.error(`problem with request: ${e.message}`);
        callback(error, null);
    });

    req.end();
}

const sensorValues = [];
let validSensorCount = 0;

function main() {
    for (let sensorId = 0; sensorId < devices; sensorId++) {
        fetchSensorValue(sensorId, (err, value) => {
            if (!err && value !== null) {
                sensorValues.push(value);
                validSensorCount++;
            }
            if (validSensorCount === devices) {
                if (sensorValues.length === 0) {
                    console.error('No valid sensor values found.');
                } else {
                    const sumOfValues = sensorValues.reduce((sum, val) => sum + val, 0);
                    const averageValue = sumOfValues / sensorValues.length;
                    console.log(`Average sensor value: ${averageValue}`);
                }
            }
        });
    }
}

main();