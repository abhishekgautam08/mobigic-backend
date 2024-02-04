const AWS = require("aws-sdk");
const access_Key = process.env.AWS_ACCESS_KEY;
const secret_access_Key = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;
const awsRegion = process.env.AWS_REGION;

const fs = require("fs");

const s3Upload = async (dynamicKey, file) => {
  const s3 = new AWS.S3({
    accessKeyId: access_Key,
    secretAccessKey: secret_access_Key,
    region: awsRegion,
  });

  const params = {
    Key: dynamicKey,
    Body: file.buffer,
    Bucket: bucketName,
    ContentType: "application/pdf",
    ACL: "public-read",
    // Expires: 60 * 60,
  };

  // Upload the file to S3
  const s3UploadPromise = new Promise((resolve, reject) => {
    s3.upload(params, (err, res) => {
      if (err) {
        reject(err);
        console.log(err);
      }

      return resolve(res.Location);
    });
  });
  return await s3UploadPromise;
};

const getSignedUrl = async (dynamicKey) => {
  const s3 = new AWS.S3({
    accessKeyId: access_Key,
    secretAccessKey: secret_access_Key,
    region: awsRegion,
  });

  const params = {
    Bucket: bucketName,
    Key: dynamicKey,
    // Set the expiration time as needed
  };

  // Generate a signed URL for the uploaded file
  const getSignedUrlPromise = new Promise((resolve, reject) => {
    s3.getSignedUrl("getObject", params, (err, url) => {
      if (err) {
        reject(err);
        console.error("Error generating signed URL:", err);
      } else {
        resolve(url);
      }
    });
  });

  return await getSignedUrlPromise;
};

module.exports = {
  s3Upload,
  getSignedUrl,
};
