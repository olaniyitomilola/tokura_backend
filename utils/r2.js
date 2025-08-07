const { S3, S3Client, ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand, } = require('@aws-sdk/client-s3');



const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.CFENDPOINT,
  credentials: {
    accessKeyId: process.env.CFACCESSKEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  }
});


const listObjects = async () => {
  const command = new ListObjectsV2Command({
    Bucket: "tokura", // 👈 Use your actual R2 bucket name
  });


  try {
     const { Contents } = await s3.send(command);

    if (!Contents) return [];

    const urls = Contents.map(obj => {
      return `${process.env.PUBLIC_URL}/${obj.Key}`;
    });

    return urls;
  } catch (err) {
    console.error("Failed to list public URLs:", err);
    return [];
  }
  
};


const uploadObject = async() =>{

}


module.exports = {s3}


