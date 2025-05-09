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
exports.QuizRepository = exports.Quiz = void 0;
const typeorm_1 = require("typeorm");
const postgresdb_1 = require("../../postgresdb");
let Quiz = class Quiz extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'quiz_id' }),
    __metadata("design:type", Number)
], Quiz.prototype, "quizId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_id' }),
    __metadata("design:type", Number)
], Quiz.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'question' }),
    __metadata("design:type", String)
], Quiz.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'marks' }),
    __metadata("design:type", Number)
], Quiz.prototype, "marks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'option1' }),
    __metadata("design:type", String)
], Quiz.prototype, "option1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'option2' }),
    __metadata("design:type", String)
], Quiz.prototype, "option2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'option3' }),
    __metadata("design:type", String)
], Quiz.prototype, "option3", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'option4' }),
    __metadata("design:type", String)
], Quiz.prototype, "option4", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'answer' }),
    __metadata("design:type", String)
], Quiz.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' }),
    __metadata("design:type", Date)
], Quiz.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' }),
    __metadata("design:type", Date)
], Quiz.prototype, "updatedAt", void 0);
Quiz = __decorate([
    (0, typeorm_1.Entity)()
], Quiz);
exports.Quiz = Quiz;
const QuizRepository = () => {
    return postgresdb_1.DbConnections.AppDbConnection.getConnection().getRepository(Quiz);
};
exports.QuizRepository = QuizRepository;
