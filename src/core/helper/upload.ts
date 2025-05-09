// import AWS from 'aws-sdk';
// import multerS3 from 'multer-s3';
// import multer from 'multer';
// import { config } from '../config';

// const { AWSACCESSKEY, AWSSECRETKEY, AWSBUCKETNAME, AWSREGION } = config();

// AWS.config.update({
//   accessKeyId: AWSACCESSKEY,
//   secretAccessKey: AWSSECRETKEY
// });

// export const upload = multer({
//   storage: multerS3({
//     s3: new AWS.S3(),
//     bucket: AWSBUCKETNAME,
//     key: function (req: any, file: any, cb: (any)) {
//       // const array = [];
//       const fileName = file.originalname.replace(/\s/g, '');
//       // array.push({ media:  })
//       // req.file = `/post/${Date.now() + fileName}`;
//       cb(null, `/post/${Date.now() + fileName}`);
//     }
//   })
// });
