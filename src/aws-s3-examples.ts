import {
  S3Client,
  ListBucketsCommand,
  CreateBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import * as fs from 'fs';
import { Readable, Duplex } from 'stream';
import sharp = require('sharp');
require('dotenv').config();

// Create S3 service object
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  apiVersion: 'latest',
  // credentials: { accessKeyId: process.env.AWS_KEY, secretAccessKey: process.env.AWS_SECRET },
  // credential автоматически грузится из .env
});

const runListBackets = async () => {
  try {
    const data = await s3.send(new ListBucketsCommand({}));
    console.log('Success', data.Buckets);
  } catch (err) {
    console.log('Error', err);
  }
};

//Attempt to create the bucket
const runCreateBacket = async () => {
  try {
    const data = await s3.send(new CreateBucketCommand({ Bucket: 'test-create46' }));
    console.log('Success', data.Location);
  } catch (err) {
    console.log('Error', err);
  }
};

// Create and upload the object to the specified Amazon S3 bucket.
const runUploadFile = async () => {
  const fileContent = fs.readFileSync('F:/tempg/picts/214061016001202.jpg');

  // Set the parameters.
  const uploadParams = {
    Bucket: 'pict26',
    // Specify the name of the new object. For example, 'index.html'.
    // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
    Key: 'imgs/pict1.jpg',
    // Content of the new object.
    Body: fileContent,
    // ContentType:"binary/octet-stream",
    ContentType: 'image/jpeg',
    // StorageClass:
  };

  try {
    const data = await s3.send(new PutObjectCommand(uploadParams));
    console.log('Successfully uploaded object: ' + uploadParams.Bucket + '/' + uploadParams.Key);
    console.log(data);
  } catch (err) {
    console.log('Error', err);
  }
};

// Create and upload the object to the specified Amazon S3 bucket.
const runUploadFileStream = async () => {
  const fileStream = fs.createReadStream('F:/tempg/picts/214061016001202.jpg');

  // Set the parameters.
  const uploadParams = {
    Bucket: 'pict26',
    // Specify the name of the new object. For example, 'index.html'.
    // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
    Key: 'imgs/pict1.jpg',
    // Content of the new object.
    Body: fileStream,
    // ContentType:"binary/octet-stream",
    ContentType: 'image/jpeg',
    // StorageClass:
  };

  try {
    const data = await s3.send(new PutObjectCommand(uploadParams));
    console.log('Successfully uploaded object: ' + uploadParams.Bucket + '/' + uploadParams.Key);
    console.log(data);
  } catch (err) {
    console.log('Error', err);
  }
};

// Create and upload the object to the specified Amazon S3 bucket.
const runDownLoadFile = async () => {
  // Set the parameters.
  const getParams = {
    Bucket: 'pict26',
    // Specify the name of the new object. For example, 'index.html'.
    // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
    Key: 'package.json',
  };

  try {
    const data = await s3.send(new GetObjectCommand(getParams));
    console.log('Successfully download object: ');
    // The new APIs are returning Node streams.

    // use the get-stream npm package to read into a Buffer.
    // https://www.npmjs.com/package/get-stream
    // Get a stream as a string, buffer, or array

    // const content_buffer: Buffer | null = null;

    const inpStream: NodeJS.ReadableStream = data.Body as NodeJS.ReadableStream;
    if (inpStream instanceof Readable) {
      // content_buffer = await getStream.buffer(file_stream as any);

      const bufs = [];
      let body = '';

      inpStream.on('data', function (chunk) {
        bufs.push(chunk);
        console.log('inpStream.on');
      });
      inpStream.on('end', function () {
        body = Buffer.concat(bufs).toString();
        // console.log(body);
        // body = Buffer.concat(bufs).toString('base64');
      });

      // data.Body.pipe(createWriteStream(fileName));
    } else {
      throw new Error('Unknown object stream type.');
    }
  } catch (err) {
    console.log('Error', err);
  }
};

const runDownLoadFile2 = async () => {
  // Set the parameters.
  const getParams = {
    Bucket: 'pict26',
    Key: 'imgs/pict1.jpg',
  };

  try {
    const data = await s3.send(new GetObjectCommand(getParams));
    console.log('Successfully download object: ');
    // The new APIs are returning Node streams.

    const inpStream: ReadableStream = data.Body as ReadableStream;
    if (inpStream instanceof Readable) {
      const uploadParams = {
        Bucket: 'picts25',
        Key: 'imgs-copy/pict1.jpg',
        Body: inpStream,
        ContentType: 'image/jpeg',
      };

      try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        console.log('Successfully uploaded object: ' + uploadParams.Bucket + '/' + uploadParams.Key);
      } catch (err) {
        console.log('Error', err);
      }

      // data.Body.pipe(createWriteStream(fileName));
    } else {
      throw new Error('Unknown object stream type.');
    }
  } catch (err) {
    console.log('Error', err);
  }
};

const compressImage = async () => {
  // Set the parameters.
  const getParams = {
    Bucket: 'pict26',
    Key: 'imgs/pict1.jpg',
  };

  try {
    const data = await s3.send(new GetObjectCommand(getParams));
    console.log('Successfully download object: ');
    // The new APIs are returning Node streams.

    const inpStream: Readable = data.Body as Readable;

    const transformer: Duplex = sharp()
      .resize({
        width: 1000,
        height: 1000,
        fit: sharp.fit.contain,
        position: sharp.gravity.centre,
        background: { r: 46, g: 138, b: 138, alpha: 1 },
        fastShrinkOnLoad: true,
      })
      .toFormat(sharp.format.jpeg);

    const uploadParams = {
      Bucket: 'picts25',
      Key: 'imgs-compress/pict1.jpg',
      Body: inpStream.pipe(transformer),
      ContentType: 'image/jpeg',
    };

    try {
      const data = await s3.send(new PutObjectCommand(uploadParams));
      console.log('Successfully uploaded object: ' + uploadParams.Bucket + '/' + uploadParams.Key);
    } catch (err) {
      console.log('Error', err);
    }
  } catch (err) {
    console.log('Error', err);
  }
};

// runListBackets();
// runCreateBacket();
// runUploadFile();

// runDownLoadFile();
// runUploadFileStream();
// runDownLoadFile2();
compressImage();

/*
const stream = fs.createReadStream(imagePath);

const transform = Sharp().resize(width, height, {
  fit: crop
}).toFormat(format, {
  quality: parseInt(quality)
});

stream.pipe(transform).on(‘error’, (e) => {
}).pipe(res);
return stream;
 */

/*
//create the stream — so basically read the path
const stream = fs.createReadStream(imagePath);
//transform the image based on our variable, then output using the quality
const transform = Sharp().resize(width, height, {
  fit: crop
}).toFormat(format, {
  quality: parseInt(quality)
});
//make sure the content type is set for the correct format.
res.set(‘Content-Type’, `image/${format}`);
//then output the image
stream.pipe(transform).on(‘error’, (e) => {
}).pipe(res);
return stream;
 */

// https://betterprogramming.pub/sharp-high-performance-node-js-image-processing-library-3f04df66c722
// https://codesandbox.io/s/magical-feather-ushwn?from-embed
/*
sharp("example-image.jpg")
  .resize({ width: 500, height: 450 })
  .toFormat("png")
  .png({ quality: 100 })
  .toFile("output.png");
 */

/*
PNG output is always full colour at 8 or 16 bits per pixel. Indexed PNG input at 1, 2 or 4 bits per pixel is converted to 8 bits per pixel.
Some of these options require the use of a globally-installed libvips compiled with support for libimagequant (GPL). — According to the Sharp official documentation.
 */
