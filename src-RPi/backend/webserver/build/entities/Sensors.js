"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var Sensor = (function () {
    function Sensor() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn('uuid'),
        __metadata("design:type", String)
    ], Sensor.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column({ type: "text", nullable: true }),
        __metadata("design:type", String)
    ], Sensor.prototype, "currentPlantId", void 0);
    __decorate([
        typeorm_1.Column("text"),
        __metadata("design:type", String)
    ], Sensor.prototype, "name", void 0);
    __decorate([
        typeorm_1.Column({ type: "int", nullable: true }),
        __metadata("design:type", Number)
    ], Sensor.prototype, "dataPin", void 0);
    __decorate([
        typeorm_1.Column({ type: "int", nullable: true }),
        __metadata("design:type", Number)
    ], Sensor.prototype, "powerPin", void 0);
    __decorate([
        typeorm_1.Column("int"),
        __metadata("design:type", Number)
    ], Sensor.prototype, "type", void 0);
    __decorate([
        typeorm_1.Column("int"),
        __metadata("design:type", Number)
    ], Sensor.prototype, "state", void 0);
    Sensor = __decorate([
        typeorm_1.Entity()
    ], Sensor);
    return Sensor;
}());
exports.Sensor = Sensor;
//# sourceMappingURL=Sensors.js.map