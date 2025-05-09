"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const config_1 = require("../../../core/config");
const common_1 = require("../../../core/types/Constent/common");
const { accessKey, secretKey, bucketName, region } = (0, config_1.config)();
class s3Upload {
    constructor() {
        this._s3 = new aws_sdk_1.default.S3({ signatureVersion: 'v4', accessKeyId: accessKey, secretAccessKey: secretKey, region: region });
    }
    //   async getFile(key: string, bucketName:string) {
    //     try {
    //       const params = {
    //         Bucket: bucketName,
    //         Key: key
    //       };
    //       var theObject = await this._s3.getObject(params).promise();
    //       return theObject;
    //     } catch (error) {
    //       console.log(error);
    //       return;
    //     }
    //   }
    getSignedUrlForStore(name, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const TEN_MB = 10 * 1024 * 1024;
            const key = `${userId}/${Date.now()}${name.replace(/\s+/g, '_')}`;
            const params = {
                Bucket: bucketName,
                Conditions: [
                    ["content-length-range", 0, TEN_MB],
                    // [ "starts-with", "$Content-Type", "text/" ],
                ],
                Expires: 240,
                Fields: Object.assign({ key }, (name.endsWith(".pdf") ? { 'Content-Type': 'application/pdf' } : {}))
            };
            // const s3 = new AWS.S3();
            // const paramss: AWS.S3.PutBucketPolicyRequest = {
            //     Bucket: "pladis-staging",
            //     Policy: JSON.stringify({
            //       "Version": "2012-10-17",
            //       "Statement": [
            //         {
            //           "Sid": "PublicRead",
            //           "Effect": "Allow",
            //           "Principal": "*",
            //           "Action": ["s3:GetObject"],
            //           "Resource": ["arn:aws:s3:::pladis-staging/*"]
            //         }
            //       ]
            //     })
            //   };
            //   this._s3.putBucketPolicy(paramss, (err, data) => {
            //     if (err) {
            //       console.log("Error", err);
            //     } else {
            //       console.log("Success", data);
            //     }
            //   });
            const response = this._s3.createPresignedPost(params);
            const data = {
                fields: response.fields,
                url: response.url,
                fileUrl: `${response.url}/${response.fields.key}`
            };
            return ({ data, message: 'Success', status: common_1.STATUSCODES.SUCCESS });
        });
    }
}
exports.S3Service = s3Upload;
