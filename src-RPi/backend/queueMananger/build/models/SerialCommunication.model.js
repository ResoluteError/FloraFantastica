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
var SerialActionRequest = (function (_super) {
    __extends(SerialActionRequest, _super);
    function SerialActionRequest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = SerialRequestType.Action;
        return _this;
    }
    return SerialActionRequest;
}(SerialRequest));
exports.SerialActionRequest = SerialActionRequest;
var SerialMeasurementRequest = (function (_super) {
    __extends(SerialMeasurementRequest, _super);
    function SerialMeasurementRequest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = SerialRequestType.Measurement;
        return _this;
    }
    return SerialMeasurementRequest;
}(SerialRequest));
exports.SerialMeasurementRequest = SerialMeasurementRequest;
var SerialResponseType;
(function (SerialResponseType) {
    SerialResponseType[SerialResponseType["Error"] = 0] = "Error";
    SerialResponseType[SerialResponseType["Confirmation"] = 1] = "Confirmation";
    SerialResponseType[SerialResponseType["Measurement"] = 2] = "Measurement";
    SerialResponseType[SerialResponseType["Action"] = 3] = "Action";
    SerialResponseType[SerialResponseType["IsAlive"] = 4] = "IsAlive";
    SerialResponseType[SerialResponseType["IsBusy"] = 5] = "IsBusy";
})(SerialResponseType = exports.SerialResponseType || (exports.SerialResponseType = {}));
var SerialRequestType;
(function (SerialRequestType) {
    SerialRequestType[SerialRequestType["Measurement"] = 0] = "Measurement";
    SerialRequestType[SerialRequestType["Action"] = 1] = "Action";
})(SerialRequestType = exports.SerialRequestType || (exports.SerialRequestType = {}));
var SerialActionType;
(function (SerialActionType) {
    SerialActionType[SerialActionType["Watering"] = 0] = "Watering";
    SerialActionType[SerialActionType["Led"] = 1] = "Led";
})(SerialActionType = exports.SerialActionType || (exports.SerialActionType = {}));
var SerialActionActivationType;
(function (SerialActionActivationType) {
    SerialActionActivationType[SerialActionActivationType["TurnOff"] = 0] = "TurnOff";
    SerialActionActivationType[SerialActionActivationType["TurnOn"] = 1] = "TurnOn";
    SerialActionActivationType[SerialActionActivationType["Duration"] = 2] = "Duration";
})(SerialActionActivationType = exports.SerialActionActivationType || (exports.SerialActionActivationType = {}));
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
var SerialActionResponse = (function (_super) {
    __extends(SerialActionResponse, _super);
    function SerialActionResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SerialActionResponse;
}(SerialResponse));
exports.SerialActionResponse = SerialActionResponse;
//# sourceMappingURL=SerialCommunication.model.js.map