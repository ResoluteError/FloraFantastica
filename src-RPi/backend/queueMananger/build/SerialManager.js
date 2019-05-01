"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var SerialPort = require("serialport");
var SerialCommunication_model_1 = require("./models/SerialCommunication.model");
var SerialManager = (function () {
    function SerialManager(responseSubscribeable) {
        this.responseSubscribeable = responseSubscribeable;
        this.portReady = false;
        this.setupSerial();
        this.listenForSerial();
    }
    SerialManager.prototype.setupSerial = function () {
        var _this = this;
        this.port = new SerialPort(config_1.CONFIG.ARDUINO_PORT, {
            baudRate: config_1.CONFIG.ARDUINO_BAUD_RATE
        }, function (err) {
            if (err) {
                console.log("[SerialManager] Error opening serial port!");
                console.log(err);
                return;
            }
            _this.portReady = true;
        });
        var readline = new SerialPort.parsers.Readline({ delimiter: '\r\n' });
        this.parser = this.port.pipe(readline);
    };
    SerialManager.prototype.getPortStatus = function () {
        console.log("[SerialManager] Port Status: " + this.portReady);
        return this.portReady;
    };
    SerialManager.prototype.kill = function () {
        console.log("[SerialManager] Killing Process");
        return process.exit();
    };
    SerialManager.prototype.listenForSerial = function () {
        var _this = this;
        this.parser.on('data', function (data) {
            try {
                var response = JSON.parse(data);
                console.log("[SerialManager] Received JSON response", response);
                _this.responseSubscribeable.next(response);
            }
            catch (_a) {
                console.log("[SerialManager] String not JSON parseable " + data);
                var errorResponse = {
                    type: SerialCommunication_model_1.SerialResponseType.Error,
                    code: SerialCommunication_model_1.SerialErrorCode.INVALID_SERIAL_RESPONSE,
                    message: "Serial string NOT parseable: '" + data + "'"
                };
                _this.responseSubscribeable.next(errorResponse);
            }
        });
    };
    SerialManager.prototype.requestMeasurementSerial = function (data) {
        var sendData = {
            type: SerialCommunication_model_1.SerialRequestType.Measurement,
            queueId: data.id,
            sensorType: data.sensorType,
            dataPin: data.dataPin,
            powerPin: data.powerPin
        };
        this.sendRequest(sendData);
    };
    SerialManager.prototype.requestActionSerial = function (data) {
        var sendData = {
            type: SerialCommunication_model_1.SerialRequestType.Action,
            queueId: data.id,
            actionType: data.actionType,
            actionPin: data.actionPin,
            activationType: data.activationType
        };
        if (data.activationType === SerialCommunication_model_1.SerialActionActivationType.Duration) {
            sendData.duration = data.duration;
        }
        this.sendRequest(sendData);
    };
    SerialManager.prototype.sendRequest = function (sendData) {
        var serializedSendData = JSON.stringify(sendData) + "\0\r\n";
        console.log("[SerialManager] Sending Data: ", serializedSendData);
        this.port.write(JSON.stringify(sendData), function (err) {
            if (err) {
                console.log("[SerialManager] An error occured: ", err);
            }
        });
    };
    return SerialManager;
}());
exports.SerialManager = SerialManager;
//# sourceMappingURL=SerialManager.js.map