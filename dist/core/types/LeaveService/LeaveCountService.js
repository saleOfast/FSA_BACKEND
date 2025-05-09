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
exports.LeaveHeadCountD = exports.LeaveHeadCountU = exports.LeaveHeadCountR = exports.LeaveHeadCountC = void 0;
const class_validator_1 = require("class-validator");
class LeaveHeadCountC {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LeaveHeadCountC.prototype, "headLeaveId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Date)
], LeaveHeadCountC.prototype, "financialStart", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Date)
], LeaveHeadCountC.prototype, "financialEnd", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LeaveHeadCountC.prototype, "totalHeadLeave", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], LeaveHeadCountC.prototype, "status", void 0);
exports.LeaveHeadCountC = LeaveHeadCountC;
class LeaveHeadCountR {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeaveHeadCountR.prototype, "headLeaveCntId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeaveHeadCountR.prototype, "headLeaveId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], LeaveHeadCountR.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LeaveHeadCountR.prototype, "mode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], LeaveHeadCountR.prototype, "leave_head_count", void 0);
exports.LeaveHeadCountR = LeaveHeadCountR;
class LeaveHeadCountU {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LeaveHeadCountU.prototype, "headLeaveCntId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LeaveHeadCountU.prototype, "headLeaveId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)()
    // @IsDate()
    ,
    __metadata("design:type", Date)
], LeaveHeadCountU.prototype, "financialStart", void 0);
__decorate([
    (0, class_validator_1.IsOptional)()
    // @IsDate()
    ,
    __metadata("design:type", Date)
], LeaveHeadCountU.prototype, "financialEnd", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LeaveHeadCountU.prototype, "totalHeadLeave", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], LeaveHeadCountU.prototype, "status", void 0);
exports.LeaveHeadCountU = LeaveHeadCountU;
class LeaveHeadCountD {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LeaveHeadCountD.prototype, "headLeaveCntId", void 0);
exports.LeaveHeadCountD = LeaveHeadCountD;
