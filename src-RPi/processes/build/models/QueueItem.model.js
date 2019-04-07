"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QueueItem = (function () {
    function QueueItem() {
    }
    return QueueItem;
}());
exports.QueueItem = QueueItem;
var QueueItemType;
(function (QueueItemType) {
    QueueItemType["Self"] = "self";
    QueueItemType["Cron"] = "cron";
    QueueItemType["Webserver"] = "webserver";
})(QueueItemType = exports.QueueItemType || (exports.QueueItemType = {}));
var SensorTypes;
(function (SensorTypes) {
    SensorTypes[SensorTypes["AIR_TEMP"] = 10] = "AIR_TEMP";
    SensorTypes[SensorTypes["AIR_HUMID"] = 11] = "AIR_HUMID";
    SensorTypes[SensorTypes["SOIL_MOIST"] = 20] = "SOIL_MOIST";
    SensorTypes[SensorTypes["SOIL_TEMP"] = 21] = "SOIL_TEMP";
    SensorTypes[SensorTypes["LIGHT_INT"] = 30] = "LIGHT_INT";
})(SensorTypes = exports.SensorTypes || (exports.SensorTypes = {}));
//# sourceMappingURL=QueueItem.model.js.map