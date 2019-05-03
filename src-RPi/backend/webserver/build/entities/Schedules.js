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
var Schedule = (function () {
    function Schedule() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn('uuid'),
        __metadata("design:type", String)
    ], Schedule.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column({ type: "text", unique: true }),
        __metadata("design:type", String)
    ], Schedule.prototype, "plantId", void 0);
    __decorate([
        typeorm_1.Column("boolean"),
        __metadata("design:type", Boolean)
    ], Schedule.prototype, "active", void 0);
    __decorate([
        typeorm_1.Column({ type: "int", nullable: true }),
        __metadata("design:type", Number)
    ], Schedule.prototype, "minDurationSinceWatering", void 0);
    __decorate([
        typeorm_1.Column({ type: "int", nullable: true }),
        __metadata("design:type", Number)
    ], Schedule.prototype, "minSoilDryness", void 0);
    __decorate([
        typeorm_1.Column({ type: "int", nullable: true }),
        __metadata("design:type", Number)
    ], Schedule.prototype, "maxLight", void 0);
    __decorate([
        typeorm_1.Column("int"),
        __metadata("design:type", Number)
    ], Schedule.prototype, "valvePin", void 0);
    __decorate([
        typeorm_1.Column("int"),
        __metadata("design:type", Number)
    ], Schedule.prototype, "duration", void 0);
    __decorate([
        typeorm_1.CreateDateColumn(),
        __metadata("design:type", String)
    ], Schedule.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn(),
        __metadata("design:type", String)
    ], Schedule.prototype, "updatedAt", void 0);
    Schedule = __decorate([
        typeorm_1.Entity()
    ], Schedule);
    return Schedule;
}());
exports.Schedule = Schedule;
//# sourceMappingURL=Schedules.js.map