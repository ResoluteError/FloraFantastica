"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = {
    UPLOADS_DIR: process.env.UPLOADS_DIR || __dirname + "/../public/uploads",
    PUBLIC_DIR: process.env.PUBLIC_DIR || __dirname + "/../public",
    FRONTEND_DIR: process.env.FRONTEND_DIR || __dirname + "/../frontend/dist",
    WEBSERVER_PORT: process.env.WEBSERVER_PORT || 8080,
    QUEUE_MANAGER_PORT: process.env.QUEUE_MANAGER_PORT || 8081,
};
//# sourceMappingURL=config.js.map