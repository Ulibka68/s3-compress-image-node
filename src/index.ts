import { compressImage } from './ImageCompress';
import { YC } from './yc';

/*
 inpBacketName: string,
  inpPictName,
  width: number,
  height: number,
  imageFormat: 'jpg' | 'png' = 'jpg',
  fit: keyof FitEnum = sharp.fit.contain,
  position: number | string = sharp.gravity.centre,
  bckgrndColor: RGBA = { r: 46, g: 138, b: 138, alpha: 1 },
 */

module.exports.handler = async function (event: YC.CloudFunctionsHttpEvent) {
  const retParm = {
    httpMethod: event.httpMethod,
    queryStringParameters: event.queryStringParameters,
  };

  const { httpMethod, queryStringParameters } = event;

  if (httpMethod != 'GET')
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ errMsg: 'Используйте метод GET для получения картинки' }),
      isBase64Encoded: false,
    };

  const mustHaveParams = ['inpBacketName', 'inpPictName', 'width', 'height'];
  if (!mustHaveParams.every((element) => queryStringParameters[element]))
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        errMsg: "Вы не передали один из обязательных параметров : 'inpBacketName', 'inpPictName', 'width', 'height'",
      }),
      isBase64Encoded: false,
    };

  if (queryStringParameters.imageFormat && !['jpg', 'png'].includes(queryStringParameters.imageFormat))
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        errMsg: 'Параметр imageFormat должен быть jpg или png',
      }),
      isBase64Encoded: false,
    };

  if (queryStringParameters.width && isNaN(queryStringParameters.width as any))
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        errMsg: `Параметр width должен быть числом : ${queryStringParameters.width}`,
      }),
      isBase64Encoded: false,
    };
  if (queryStringParameters.height && isNaN(queryStringParameters.height as any))
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        errMsg: `Параметр height должен быть числом : ${queryStringParameters.height}`,
      }),
      isBase64Encoded: false,
    };

  const retImgs = await compressImage(
    queryStringParameters.inpBacketName,
    queryStringParameters.inpPictName,
    parseInt(queryStringParameters.width),
    parseInt(queryStringParameters.height),
    queryStringParameters.imageFormat as any,
  );
  // compressImage('pict26', 'imgs/20210323_070123.jpg', 400, 400, 'png');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    // body: JSON.stringify(retParm),
    body: JSON.stringify(retImgs),
    isBase64Encoded: false,
  };
};
