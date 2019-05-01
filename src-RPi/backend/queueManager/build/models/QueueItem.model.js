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
var SerialCommunication_model_1 = require("./SerialCommunication.model");
var QueueItem = (function () {
    function QueueItem() {
    }
    return QueueItem;
}());
exports.QueueItem = QueueItem;
var MeasurementQueueItem = (function (_super) {
    __extends(MeasurementQueueItem, _super);
    function MeasurementQueueItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = SerialCommunication_model_1.SerialRequestType.Measurement;
        return _this;
    }
    return MeasurementQueueItem;
}(QueueItem));
exports.MeasurementQueueItem = MeasurementQueueItem;
var ActionQueueItem = (function (_super) {
    __extends(ActionQueueItem, _super);
    function ActionQueueItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = SerialCommunication_model_1.SerialRequestType.Action;
        return _this;
    }
    return ActionQueueItem;
}(QueueItem));
exports.ActionQueueItem = ActionQueueItem;
var QueueItemOrigin;
(function (QueueItemOrigin) {
    QueueItemOrigin["Self"] = "self";
    QueueItemOrigin["Cron"] = "cron";
    QueueItemOrigin["Webserver"] = "webserver";
})(QueueItemOrigin = exports.QueueItemOrigin || (exports.QueueItemOrigin = {}));
var SensorTypes;
(function (SensorTypes) {
    SensorTypes[SensorTypes["AIR_TEMP"] = 10] = "AIR_TEMP";
    SensorTypes[SensorTypes["AIR_HUMID"] = 11] = "AIR_HUMID";
    SensorTypes[SensorTypes["SOIL_MOIST"] = 20] = "SOIL_MOIST";
    SensorTypes[SensorTypes["SOIL_TEMP"] = 21] = "SOIL_TEMP";
    SensorTypes[SensorTypes["LIGHT_INT"] = 30] = "LIGHT_INT";
})(SensorTypes = exports.SensorTypes || (exports.SensorTypes = {}));
var QueueItemStatus;
(function (QueueItemStatus) {
    QueueItemStatus[QueueItemStatus["Completed"] = 0] = "Completed";
    QueueItemStatus[QueueItemStatus["ConfirmedTimeOut"] = 1] = "ConfirmedTimeOut";
    QueueItemStatus[QueueItemStatus["Confirmed"] = 2] = "Confirmed";
    QueueItemStatus[QueueItemStatus["SubmittedTimeOut"] = 3] = "SubmittedTimeOut";
    QueueItemStatus[QueueItemStatus["Submitted"] = 4] = "Submitted";
    QueueItemStatus[QueueItemStatus["ReadyForSubmit"] = 5] = "ReadyForSubmit";
    QueueItemStatus[QueueItemStatus["Unknown"] = 6] = "Unknown";
})(QueueItemStatus = exports.QueueItemStatus || (exports.QueueItemStatus = {}));
//# sourceMappingURL=QueueItem.model.js.map