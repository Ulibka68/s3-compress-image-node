const yc = require('yandex-cloud');

module.exports.handler = async function (event, context) {
  const retParm = {
    httpMethod: event.httpMethod,
    queryStringParameters: event.queryStringParameters,
  };

  console.log(retParm);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(retParm),
    isBase64Encoded: false,
  };
};
