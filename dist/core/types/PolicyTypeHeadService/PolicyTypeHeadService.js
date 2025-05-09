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
exports.PolicyTypeHeadD = exports.PolicyTypeHeadU = exports.PolicyTypeHeadR = exports.PolicyTypeHeadC = void 0;
const class_validator_1 = require("class-validator");
const common_1 = require("../Constent/common");
class PolicyTypeHeadC {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyTypeHeadC.prototype, "policy_type_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Number)
], PolicyTypeHeadC.prototype, "policy_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Date)
], PolicyTypeHeadC.prototype, "from_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Date)
], PolicyTypeHeadC.prototype, "to_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PolicyTypeHeadC.prototype, "claim_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Number)
], PolicyTypeHeadC.prototype, "cost_per_km", void 0);
exports.PolicyTypeHeadC = PolicyTypeHeadC;
class PolicyTypeHeadR {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyTypeHeadR.prototype, "policy_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyTypeHeadR.prototype, "policy_type_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], PolicyTypeHeadR.prototype, "from_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], PolicyTypeHeadR.prototype, "policy_type_name", void 0);
exports.PolicyTypeHeadR = PolicyTypeHeadR;
class PolicyTypeHeadU {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PolicyTypeHeadU.prototype, "policy_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], PolicyTypeHeadU.prototype, "policy_type_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PolicyTypeHeadU.prototype, "policy_type_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], PolicyTypeHeadU.prototype, "from_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], PolicyTypeHeadU.prototype, "to_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PolicyTypeHeadU.prototype, "claim_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PolicyTypeHeadU.prototype, "cost_per_km", void 0);
exports.PolicyTypeHeadU = PolicyTypeHeadU;
class PolicyTypeHeadD {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], PolicyTypeHeadD.prototype, "policy_type_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Number)
], PolicyTypeHeadD.prototype, "policy_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PolicyTypeHeadD.prototype, "is_travel", void 0);
exports.PolicyTypeHeadD = PolicyTypeHeadD;
