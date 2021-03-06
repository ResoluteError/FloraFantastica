"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var express = require("express");
var PlantsRouter_1 = require("./routes/PlantsRouter");
var MeasurementsRouter_1 = require("./routes/MeasurementsRouter");
var SensorsRouter_1 = require("./routes/SensorsRouter");
var SeedRouter_1 = require("./routes/SeedRouter");
var ActionsRouter_1 = require("./routes/ActionsRouter");
var SchedulesRouter_1 = require("./routes/SchedulesRouter");
var typeorm_1 = require("typeorm");
var bodyParser = require("body-parser");
var config_1 = require("./config");
var http = require("http");
var authorizer_1 = require("./auth/authorizer");
console.log("======= ENVIRONMENT DEBUG ======");
console.log("PROD_MODE: " + config_1.CONFIG.PROD_MODE);
console.log("Path to uploads: " + config_1.CONFIG.UPLOADS_DIR);
console.log("Serving public from: " + config_1.CONFIG.PUBLIC_DIR);
console.log("Serving frontend from: " + config_1.CONFIG.FRONTEND_DIR);
console.log("TYPE_ORM Constants ");
console.log("TYPEORM_CONNECTION: " + process.env.TYPEORM_CONNECTION);
console.log("TYPEORM_DATABASE: " + process.env.TYPEORM_DATABASE);
console.log("TYPEORM_ENTITIES: " + process.env.TYPEORM_ENTITIES);
console.log("===================");
typeorm_1.createConnection().then(function (connection) { return __awaiter(_this, void 0, void 0, function () {
    var app, httpServer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, connection.synchronize(false)];
            case 1:
                _a.sent();
                app = express();
                app.use(function (req, res, next) {
                    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
                    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
                    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
                    next();
                });
                app.use(bodyParser.json());
                app.use(bodyParser.urlencoded({ extended: true }));
                app.use("/api/measurements/", MeasurementsRouter_1.router);
                app.use("/api/sensors/", SensorsRouter_1.router);
                app.use("/api/plants/", PlantsRouter_1.router);
                app.use("/api/actions/", ActionsRouter_1.router);
                app.use("/api/schedules/", SchedulesRouter_1.router);
                app.post("/api/login", authorizer_1.Authorizer.SimpleLogin);
                app.use("/seed/", SeedRouter_1.router);
                app.use("/uploads", express.static(config_1.CONFIG.UPLOADS_DIR));
                app.use("/.well-known", express.static(config_1.CONFIG.PUBLIC_DIR + "/.well-known/"));
                app.use(express.static(config_1.CONFIG.FRONTEND_DIR));
                app.get('*', function (req, res) {
                    res.sendFile(config_1.CONFIG.FRONTEND_DIR + "/index.html");
                });
                if (config_1.CONFIG.PROD_MODE) {
                    httpServer = http.createServer(app);
                    httpServer.listen(config_1.CONFIG.WEBSERVER_PORT, function () {
                        console.log('HTTP Server running on port 80');
                    });
                }
                else {
                    app.listen(config_1.CONFIG.WEBSERVER_PORT, function () {
                        console.log("Started FloraFantastica HTTP Server, listening on Port: " + config_1.CONFIG.WEBSERVER_PORT);
                    });
                    app.listen(config_1.CONFIG.WEBSERVER_HTTPS_PORT, function () {
                        console.log("Started FloraFantastica HTTPS Server, listening on Port: " + config_1.CONFIG.WEBSERVER_HTTPS_PORT);
                    });
                }
                return [2];
        }
    });
}); });
//# sourceMappingURL=app.js.map