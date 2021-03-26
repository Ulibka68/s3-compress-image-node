import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable, Duplex } from 'stream';
import sharp = require('sharp');
import { FitEnum, GravityEnum } from 'sharp';
require('dotenv').config();
const ReadableStreamClone = require('./cloneReadableStream');
require('./memoryUsage');

export interface RGBA {
  r: number;
  g: number;
  b: number;
  alpha: number;
}

// Create S3 service object
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  apiVersion: 'latest',
  // credentials: { accessKeyId: process.env.AWS_KEY, secretAccessKey: process.env.AWS_SECRET },
  // credential автоматически грузится из .env
});

const CompressBacketName = process.env.COMPRESSBACKETNAME;

function createGuid() {
  const S4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(2);
  return `${S4()}-${S4()}-${S4()}-${S4()}${S4()}`;
}

export const compressImage = async (
  inpBacketName: string,
  inpPictName,
  width: number,
  height: number,
  imageFormat: 'jpg' | 'png' = 'jpg',
  fit: keyof FitEnum = sharp.fit.contain,
  position: number | string = sharp.gravity.centre,
  bckgrndColor: RGBA = { r: 46, g: 138, b: 138, alpha: 1 },
): Promise<{
  jpgImage?: string;
  webpImage?: string;
  errName?: string;
}> => {
  // Set the parameters.
  const getParams = {
    Bucket: inpBacketName,
    Key: inpPictName,
  };

  const outputNameArr = inpPictName.split('/');
  let outputPictName = inpPictName;
  if (outputNameArr.length > 1) outputPictName = outputNameArr[outputNameArr.length - 1];
  outputPictName = outputPictName.split('.')[0];
  outputPictName = `imgs/${width}x${height}/${inpBacketName}/${outputPictName}`;

  try {
    const data = await s3.send(new GetObjectCommand(getParams));

    const inpStream: Readable = data.Body as Readable;
    const readClone1 = new ReadableStreamClone(inpStream, { highWaterMark: inpStream.readableHighWaterMark });
    const readClone2 = new ReadableStreamClone(inpStream, { highWaterMark: inpStream.readableHighWaterMark });

    const transformerJPEG: Duplex = sharp()
      .rotate()
      .resize({
        width,
        height,
        fit,
        position,
        background: bckgrndColor,
        fastShrinkOnLoad: true,
      })
      .toFormat(imageFormat === 'jpg' ? sharp.format.jpeg : sharp.format.png);

    const transformerWEBP: Duplex = sharp()
      .rotate()
      .resize({
        width,
        height,
        fit,
        position,
        background: bckgrndColor,
        fastShrinkOnLoad: true,
      })
      .toFormat(sharp.format.webp);

    const uploadParamsJPEG = {
      Bucket: CompressBacketName,
      Key: outputPictName + '.' + imageFormat,
      Body: readClone1.pipe(transformerJPEG),
      ContentType: imageFormat === 'jpg' ? 'image/jpeg' : 'image/png',
    };
    const uploadParamsWEBP = {
      Bucket: CompressBacketName,
      Key: outputPictName + '.webp',
      Body: readClone2.pipe(transformerWEBP),
      ContentType: 'image/webp',
    };

    let dataPut = await s3.send(new PutObjectCommand(uploadParamsJPEG));

    dataPut = await s3.send(new PutObjectCommand(uploadParamsWEBP));

    return {
      jpgImage: 'https://storage.yandexcloud.net/' + CompressBacketName + '/' + outputPictName + '.' + imageFormat,
      webpImage: 'https://storage.yandexcloud.net/' + CompressBacketName + '/' + outputPictName + '.webp',
    };
  } catch (err) {
    console.error('ERROR : ', err.name);
    if (err.name === 'NoSuchKey')
      return { errName: 'Не найдено входящее изображение : ' + inpBacketName + '/' + inpPictName };
    else return { errName: err.errName };
  }
};

// compressImage('pict26', 'imgs/pict1.jpg', 400, 400, 'png', { r: 46, g: 138, b: 138, alpha: 0 });
// 12 MB

/*
async function runCompress() {
  const retImgs = await compressImage('pict26', 'imgs/20210323_070123.jpg', 400, 400, 'png');
  console.log(retImgs);
}
runCompress();


 */
