'use strict';

const { request } = require('http');
const devices = 10;

function fetchSensorValue(sensorId, callback) {
    const options = { port: 8080, path: `/?id=${sensorId}` };
    const req = request(options, res => {
        let chunks = [];
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

    req.on('error', e => {
        console.error(`problem with request: ${e.message}`);
        callback(e);
    });

    req.end();
}

function main() {
    let sensorId = 0;
    function processNextSensor() {
        fetchSensorValue(sensorId, (e, value) => {
            if (e) {
                console.error(`Error fetching sensor data: ${e.message}`);
            } else if (value !== null) {
                console.log(`Sensor ${sensorId} value: ${value}`);
            } else {
                sensorId++;
                if (sensorId < devices) {
                    processNextSensor();
                }
            }
        });
    }

    processNextSensor();
}

main();