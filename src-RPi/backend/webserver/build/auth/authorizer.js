"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var Authorizer = (function () {
    function Authorizer() {
    }
    Authorizer.SimpleLogin = function (req, res) {
        var userPass = req.body.pass;
        if (userPass === config_1.CONFIG.PASS) {
            res.status(200).send({ "key": config_1.CONFIG.AUTH });
        }
        else {
            res.status(401).send({ "message": "Wrong Password!" });
        }
    };
    Authorizer.IsSimpleAuthorized = function (req, res, next) {
        var authHeader = req.headers.authorization;
        if (!authHeader) {
            console.log("Authorization failed - No Auth Provided!");
            return res.status(403).send({
                "message": "You must be logged in to request this endpoint"
            });
        }
        if (authHeader === config_1.CONFIG.AUTH) {
            next();
        }
        else {
            console.log("Authorization failed - Wrong Auth! Provided: ", authHeader);
            return res.status(403).send({
                "message": "You must be logged in to request this endpoint"
            });
        }
    };
    return Authorizer;
}());
exports.Authorizer = Authorizer;
//# sourceMappingURL=authorizer.js.map