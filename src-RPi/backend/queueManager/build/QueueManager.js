"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var SerialManager_1 = require("./SerialManager");
var config_1 = require("./config");
var express = require("express");
var rxjs_1 = require("rxjs");
var SerialCommunication_model_1 = require("./models/SerialCommunication.model");
var QueueItem_model_1 = require("./models/QueueItem.model");
var bodyParser = require("body-parser");
var uuid = require("uuid/v1");
var request = require("request");
var QueueManager = (function () {
    function QueueManager() {
        this.portErrCounter = 0;
        this.responseSubscribeable = new rxjs_1.Subject();
        this.queueListener = new rxjs_1.Subject();
        this.queue = [];
        this.serialManager = new SerialManager_1.SerialManager(this.responseSubscribeable);
        this.setupExpress();
        this.listenForHttp();
        this.listenForResponse();
        this.executionLoop();
    }
    QueueManager.prototype.setupExpress = function () {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    };
    QueueManager.prototype.listenForHttp = function () {
        var _this = this;
        this.app.post("/queue", function (req, res) {
            var newQueue = {
                id: req.body.id || uuid(),
                origin: req.body.origin || QueueItem_model_1.QueueItemOrigin.Webserver,
                res: res,
                type: req.body.type
            };
            switch (newQueue.type) {
                case SerialCommunication_model_1.SerialRequestType.Measurement:
                    var newMeasurementQueueItem = __assign({}, newQueue, { sensorId: req.body.sensorId, sensorType: req.body.sensorType, dataPin: req.body.dataPin, powerPin: req.body.powerPin });
                    if (Object.values(QueueItem_model_1.SensorTypes).includes(newMeasurementQueueItem.sensorType)) {
                        _this.pushToQueue(newMeasurementQueueItem, newMeasurementQueueItem.origin === QueueItem_model_1.QueueItemOrigin.Webserver);
                    }
                    else {
                        console.log("[QueueManager] ERROR - Sensor type " + newMeasurementQueueItem.sensorType + " is not an active sensor");
                        res.status(500).send("Wrong sensor type!");
                    }
                    break;
                case SerialCommunication_model_1.SerialRequestType.Action:
                    var newActionQueueItem = __assign({}, newQueue, { actionType: req.body.actionType, actionPin: req.body.actionPin, activationType: req.body.activationType, duration: req.body.duration });
                    _this.pushToQueue(newActionQueueItem, newActionQueueItem.origin === QueueItem_model_1.QueueItemOrigin.Webserver);
                    break;
            }
            console.log("[QueueManager] STATUS - Added to queue");
        });
        this.app.listen(config_1.CONFIG.QUEUE_MANAGER_PORT, function () {
            console.log("[QueueManager] STATUS - Listening on port: " + config_1.CONFIG.QUEUE_MANAGER_PORT);
        });
    };
    QueueManager.prototype.pushToQueue = function (queueItem, prioritize) {
        if (prioritize) {
            if (this.queue.length > 0 && this.queue[0].submitted) {
                this.queue = [this.queue[0], queueItem].concat(this.queue.slice(1));
            }
            else {
                this.queue = [queueItem].concat(this.queue.slice());
            }
        }
        else {
            this.queue.push(queueItem);
        }
        this.queueListener.next(this.queue);
    };
    QueueManager.prototype.listenForResponse = function () {
        var _this = this;
        this.responseSubscribeable.subscribe(function (response) {
            _this.resolveResponse(response);
        });
    };
    QueueManager.prototype.resolveResponse = function (response) {
        switch (response.type) {
            case SerialCommunication_model_1.SerialResponseType.Error:
                console.log("[QueueManager] STATUS - Received response type: Error Response");
                this.resolveError(response);
                break;
            case SerialCommunication_model_1.SerialResponseType.IsAlive:
                console.log("[QueueManager] STATUS - Received response type: IsAlive Response");
                console.log(response);
                break;
            case SerialCommunication_model_1.SerialResponseType.IsBusy:
                console.log("[QueueManager]  TATUS - Received response type: IsBusy Response");
                console.log(response);
                break;
            case SerialCommunication_model_1.SerialResponseType.Confirmation:
                console.log("[QueueManager] STATUS - Received response type: Confirmation Response");
                this.resolveConfirmation(response);
                break;
            case SerialCommunication_model_1.SerialResponseType.Measurement:
                console.log("[QueueManager] STATUS - Received response type: Measurement Response");
                this.resolveMeasurement(response);
                break;
            case SerialCommunication_model_1.SerialResponseType.Action:
                console.log("[QueueManager] STATUS - Received response type: Measurement Response");
                this.resolveAction(response);
                break;
            default:
                console.log("[QueueManager] WARNING - Unknown response type: ", response);
        }
    };
    QueueManager.prototype.resolveConfirmation = function (response) {
        console.log("[QueueManager] STATUS - Queue item " + response.queueId + " request was confirmed");
        if (response.queueId === this.queue[0].id) {
            this.queue[0].confirmed = Date.now();
            this.queueListener.next(this.queue);
        }
        else {
            var index = this.queue.findIndex(function (item) { return item.id === response.queueId; });
            if (index > -1) {
                console.log("[QueueManager] WARNING - Confirmation for index " + index + " insteaf of 0");
                this.queue[index].confirmed = Date.now();
                this.queueListener.next(this.queue);
            }
            else {
                console.log("[QueueManager] WARNING - Confirmed item is not part of queue!");
                console.log("[QueueManager] Response: ", response);
            }
        }
    };
    QueueManager.prototype.resolveAction = function (serialResponse) {
        console.log("[QueueManager] STATUS - Action Type: Queue Initiated ");
        if (serialResponse.queueId === this.queue[0].id) {
            var completedAction = this.queue.splice(0, 1)[0];
            completedAction.res.status(200).send({ success: true });
        }
        else {
            console.log("[QueueManager] WARNING - Actions Response does not match queue!");
            var queueIndex = this.queue.findIndex(function (item) { return item.id === serialResponse.queueId; });
            if (queueIndex > -1) {
                var queueItem = this.queue.splice(queueIndex, 1)[0];
                completedAction.res.status(200).send({ success: true });
            }
            else {
                console.log("[QueueManager] WARNING - No Queue item found for measurement!");
                console.log("[QueueManager] Measurement: ", serialResponse);
            }
        }
        this.queueListener.next(this.queue);
    };
    QueueManager.prototype.resolveMeasurement = function (serialResponse) {
        return __awaiter(this, void 0, void 0, function () {
            var postMeasurement, queueIndex, queueItem, queueItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!serialResponse.queueId) return [3, 1];
                        queueIndex = 0;
                        console.log("[QueueManager] STATUS - Measurement Type: Queue Initiated ");
                        if (serialResponse.queueId === this.queue[0].id) {
                            queueItem = this.queue[0];
                            queueItem.value = serialResponse.data;
                        }
                        else {
                            console.log("[QueueManager] WARNING - Measurement Response does not match queue!");
                            queueIndex = this.queue.findIndex(function (item) { return item.id === serialResponse.queueId; });
                            if (queueIndex > -1) {
                                queueItem = this.queue[queueIndex];
                                queueItem.value = serialResponse.data;
                            }
                            else {
                                console.log("[QueueManager] WARNING - No Queue item found for measurement!");
                                console.log("[QueueManager] Measurement: ", serialResponse);
                            }
                        }
                        return [3, 3];
                    case 1:
                        console.log("[QueueManager] STATUS - Measurement Type: Arduino Initiated ");
                        return [4, request.get("http://localhost:" + config_1.CONFIG.WEBSERVER_PORT + "/api/sensors/pin/" + serialResponse.dataPin, function (err, httpResponse, body) {
                                if (err) {
                                    console.log("[QueueManager] SERVER ERROR - Getting sensor for pin: " + serialResponse.dataPin, err);
                                    return;
                                }
                                if (!body.length) {
                                    console.log("[QueueManager] HTTP RESPONSE ERROR - No Sensor found for pin ", serialResponse.dataPin);
                                    return;
                                }
                                try {
                                    var sensor = JSON.parse(body);
                                    postMeasurement = {
                                        sensorId: sensor.id,
                                        data: serialResponse.data
                                    };
                                    request.post("http://localhost:" + config_1.CONFIG.WEBSERVER_PORT + "/api/measurements", { json: postMeasurement }, function (err, httpResponse, body) {
                                        if (err) {
                                            console.log("[QueueManager] ERROR - Failed posting arduino initiated measurement!");
                                            console.log("[QueueManager] ", err);
                                            return;
                                        }
                                        console.log("[QueueManager] STATUS - Successfully posted measurement to sensor: ", postMeasurement.sensorId);
                                    });
                                }
                                catch (err) {
                                    console.log("[QueueManager] ERROR - Sensor API Response was no valid json: ", body);
                                    console.log(err);
                                    return;
                                }
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this.queueListener.next(this.queue);
                        return [2];
                }
            });
        });
    };
    QueueManager.prototype.resolveError = function (response) {
        var queueIndex = this.queue.findIndex(function (item) { return item.id === response.queueId; });
        if (queueIndex > -1) {
            var item = this.queue.splice(queueIndex, 1);
            item[0].res.status(404).send(new Error("Sensor Measurement resulted in Error"));
            this.queueListener.next(this.queue);
        }
        else {
            console.log("[QueueManager] WARNING - Serial error not queue item related!");
            console.log("[QueueManager] Serial Response: ", response);
        }
    };
    QueueManager.prototype.retryAtPortError = function () {
        var _this = this;
        this.portErrCounter++;
        console.log("[QueueManager] ERROR - Failed reaching Port");
        if (this.portErrCounter < 10) {
            setTimeout(function () {
                _this.queueListener.next(_this.queue);
            }, 500);
            return;
        }
        else {
            console.log("[QueueManager] KILLING PROCESS - PortErrCounter Exceeded Limit");
            return process.exit();
        }
    };
    QueueManager.prototype.getQueueItemStatus = function (queueItem) {
        var confirmedTimeOutThreshold = 1000 * 15;
        switch (queueItem.type) {
            case SerialCommunication_model_1.SerialRequestType.Action:
                var actionItem = queueItem;
                if (actionItem.duration) {
                    confirmedTimeOutThreshold += actionItem.duration;
                }
                break;
            case SerialCommunication_model_1.SerialRequestType.Measurement:
                var measurementItem = queueItem;
                if (typeof measurementItem.value === "number") {
                    return QueueItem_model_1.QueueItemStatus.Completed;
                }
                break;
        }
        if (queueItem.confirmed < Date.now() - confirmedTimeOutThreshold) {
            return QueueItem_model_1.QueueItemStatus.ConfirmedTimeOut;
        }
        if (queueItem.confirmed) {
            return QueueItem_model_1.QueueItemStatus.Confirmed;
        }
        if (queueItem.submitted < Date.now() - 1000 * 15) {
            return QueueItem_model_1.QueueItemStatus.SubmittedTimeOut;
        }
        if (queueItem.submitted) {
            return QueueItem_model_1.QueueItemStatus.Submitted;
        }
        if (queueItem.id) {
            return QueueItem_model_1.QueueItemStatus.ReadyForSubmit;
        }
        return QueueItem_model_1.QueueItemStatus.Unknown;
    };
    QueueManager.prototype.executionLoop = function () {
        var _this = this;
        this.queueListener.subscribe(function (changedQueue) {
            if (!_this.serialManager.getPortStatus) {
                _this.retryAtPortError();
            }
            else {
                _this.portErrCounter = 0;
            }
            if (changedQueue.length > 0) {
                var firstQueueItem = changedQueue[0];
                var status = _this.getQueueItemStatus(firstQueueItem);
                switch (status) {
                    case QueueItem_model_1.QueueItemStatus.Completed:
                        console.log("[QueueManager] STATUS - Removing completed Item from Que");
                        if (firstQueueItem.type == SerialCommunication_model_1.SerialRequestType.Measurement) {
                            var removedItem = _this.queue.splice(0, 1)[0];
                            removedItem.res.status(200).send({ data: removedItem.value });
                            _this.queueListener.next(_this.queue);
                            return;
                        }
                        break;
                    case (QueueItem_model_1.QueueItemStatus.ConfirmedTimeOut,
                        QueueItem_model_1.QueueItemStatus.SubmittedTimeOut):
                        console.log("[QueueManager] WARNING - Removing timeout item from Que.");
                        var item = _this.queue.splice(0, 1)[0];
                        item.res.status(408).send(new Error("Sensor measurement timed out!"));
                        _this.queueListener.next(_this.queue);
                        break;
                    case QueueItem_model_1.QueueItemStatus.Confirmed,
                        QueueItem_model_1.QueueItemStatus.Submitted:
                        break;
                    case QueueItem_model_1.QueueItemStatus.ReadyForSubmit:
                        switch (firstQueueItem.type) {
                            case SerialCommunication_model_1.SerialRequestType.Action:
                                console.log("[QueueManager] STATUS - Requesting new action");
                                _this.serialManager.requestActionSerial(firstQueueItem);
                                break;
                            case SerialCommunication_model_1.SerialRequestType.Measurement:
                                console.log("[QueueManager] STATUS - Requesting new measurement");
                                _this.serialManager.requestMeasurementSerial(firstQueueItem);
                                break;
                        }
                        break;
                    case QueueItem_model_1.QueueItemStatus.Unknown:
                        console.log("[QueueManager] WARNING - Removing unknown queue item.");
                        console.log(firstQueueItem);
                        _this.queue.splice(0, 1);
                        _this.queueListener.next(_this.queue);
                        break;
                }
            }
        });
    };
    return QueueManager;
}());
exports.QueueManager = QueueManager;
//# sourceMappingURL=QueueManager.js.map