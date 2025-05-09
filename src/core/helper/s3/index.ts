import AWS from 'aws-sdk';
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
import { config } from '../../../core/config';
import { IApiResponse } from '../../../core/types/Constent/commonService';
import { STATUSCODES } from '../../../core/types/Constent/common';

const { accessKey, secretKey, bucketName, region } = config();

class s3Upload {
    private _s3: AWS.S3;

    constructor() {
        this._s3 = new AWS.S3({ signatureVersion: 'v4', accessKeyId: accessKey, secretAccessKey: secretKey, region: region });
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

    

    async getSignedUrlForStore(name: string, userId: number): Promise<IApiResponse> {
        const TEN_MB = 10 * 1024 * 1024;
        const key = `${userId}/${Date.now()}${name.replace(/\s+/g, '_')}`
        const params = {
            Bucket: bucketName,
            Conditions: [
                ["content-length-range", 0, TEN_MB],
                // [ "starts-with", "$Content-Type", "text/" ],
            ],
            Expires: 240,
            Fields: {
                key, 
                ...(name.endsWith(".pdf") ? { 'Content-Type': 'application/pdf' } : {})

            }
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
        const response: { url: string, fields: any } = this._s3.createPresignedPost(params);

        const data = {
            fields: response.fields,
            url: response.url,
            fileUrl: `${response.url}/${response.fields.key}`
        }

        return ({ data, message: 'Success', status: STATUSCODES.SUCCESS });
    }
}

export { s3Upload as S3Service }