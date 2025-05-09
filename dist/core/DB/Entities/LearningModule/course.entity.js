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
exports.CourseRepository = exports.Course = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../../postgresdb");
let Course = class Course extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'course_id' }),
    __metadata("design:type", Number)
], Course.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emp_id', nullable: true }),
    __metadata("design:type", Number)
], Course.prototype, "empId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_name', nullable: true }),
    __metadata("design:type", String)
], Course.prototype, "courseName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', nullable: true }),
    __metadata("design:type", String)
], Course.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: false }),
    __metadata("design:type", Boolean)
], Course.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "due_date", nullable: true }),
    __metadata("design:type", Date)
], Course.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "thumbnail_url", nullable: true }),
    __metadata("design:type", String)
], Course.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "video_link", nullable: true }),
    __metadata("design:type", String)
], Course.prototype, "videoLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "target_audience", type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Course.prototype, "targetAudience", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "quiz_time_duration_min", nullable: true }),
    __metadata("design:type", Number)
], Course.prototype, "quizDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "launched_date", nullable: true }),
    __metadata("design:type", Date)
], Course.prototype, "launchedDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Course.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Course.prototype, "updatedAt", void 0);
Course = __decorate([
    (0, typeorm_1.Entity)()
], Course);
exports.Course = Course;
const CourseRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Course);
};
exports.CourseRepository = CourseRepository;
