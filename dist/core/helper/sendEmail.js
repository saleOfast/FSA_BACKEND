"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailGenerator = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const testAccount = nodemailer_1.default.createTestAccount();
// create reusable transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: 'delbert.mclaughlin1@ethereal.email', // generated ethereal user
//         pass: 'DtXc5MY71HMuHtpqyv', // generated ethereal password
//     },
// });
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: "anilchauhan.src@gmail.com",
        pass: "boortxzpvjnzxooz"
    }
});
const emailGenerator = (toEmail, subject, html) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from: 'anilchauhan.src@gmail.com',
            to: toEmail,
            subject: subject,
            html: html, // html body
        }, (error, info) => {
            if (error) {
                console.log(error, 'error==========');
                reject(error);
            }
            else {
                resolve(info);
            }
        });
    });
};
exports.emailGenerator = emailGenerator;
