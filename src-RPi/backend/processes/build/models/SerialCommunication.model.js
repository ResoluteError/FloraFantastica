"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var SerialCommunicationBase = (function () {
    function SerialCommunicationBase() {
    }
    return SerialCommunicationBase;
}());
exports.SerialCommunicationBase = SerialCommunicationBase;
var SerialRequest = (function (_super) {
    __extends(SerialRequest, _super);
    function SerialRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SerialRequest;
}(SerialCommunicationBase));
exports.SerialRequest = SerialRequest;
var SerialResponse = (function (_super) {
    __extends(SerialResponse, _super);
    function SerialResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SerialResponse;
}(SerialCommunicationBase));
exports.SerialResponse = SerialResponse;
var SerialMeasurementRequest = (function (_super) {
    __extends(SerialMeasurementRequest, _super);
    function SerialMeasurementRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SerialMeasurementRequest;
}(SerialRequest));
exports.SerialMeasurementRequest = SerialMeasurementRequest;
var SerialCommunicationTypes;
(function (SerialCommunicationTypes) {
    SerialCommunicationTypes["Error"] = "error";
    SerialCommunicationTypes["IsAlive"] = "isAlive";
    SerialCommunicationTypes["IsBusy"] = "isBusy";
    SerialCommunicationTypes["Measurement"] = "measurement";
    SerialCommunicationTypes["Confirmation"] = "confirmation";
})(SerialCommunicationTypes = exports.SerialCommunicationTypes || (exports.SerialCommunicationTypes = {}));
var SerialErrorResponse = (function (_super) {
    __extends(SerialErrorResponse, _super);
    function SerialErrorResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SerialErrorResponse;
}(SerialResponse));
exports.SerialErrorResponse = SerialErrorResponse;
var SerialErrorCode;
(function (SerialErrorCode) {
    SerialErrorCode[SerialErrorCode["JSON_REQUEST_PARSING"] = 400] = "JSON_REQUEST_PARSING";
    SerialErrorCode[SerialErrorCode["SENSOR_NOT_FOUND"] = 404] = "SENSOR_NOT_FOUND";
    SerialErrorCode[SerialErrorCode["SENSOR_ERROR"] = 500] = "SENSOR_ERROR";
    SerialErrorCode[SerialErrorCode["INVALID_SERIAL_RESPONSE"] = 502] = "INVALID_SERIAL_RESPONSE";
})(SerialErrorCode = exports.SerialErrorCode || (exports.SerialErrorCode = {}));
var SerialIsAliveResponse = (function (_super) {
    __extends(SerialIsAliveResponse, _super);
    function SerialIsAliveResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SerialIsAliveResponse;
}(SerialResponse));
exports.SerialIsAliveResponse = SerialIsAliveResponse;
var SerialIsBusyResponse = (function (_super) {
    __extends(SerialIsBusyResponse, _super);
    function SerialIsBusyResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SerialIsBusyResponse;
}(SerialResponse));
exports.SerialIsBusyResponse = SerialIsBusyResponse;
var SerialMeasurementResponse = (function (_super) {
    __extends(SerialMeasurementResponse, _super);
    function SerialMeasurementResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SerialMeasurementResponse;
}(SerialResponse));
exports.SerialMeasurementResponse = SerialMeasurementResponse;
//# sourceMappingURL=SerialCommunication.model.js.map