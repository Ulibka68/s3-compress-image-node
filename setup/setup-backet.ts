import {
  S3Client,
  PutBucketWebsiteCommand,
  GetBucketWebsiteCommand,
  PutBucketWebsiteRequest,
} from '@aws-sdk/client-s3';

require('dotenv').config();

// Create S3 service object
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  apiVersion: 'latest',
});

const CompressBacketName = process.env.COMPRESSBACKETNAME;
// # Префикс файлов в бакете
const PREFIX = process.env.PREFIX;
const FUNCTION_ID = process.env.FUNCTION_ID; // function2

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/putbucketwebsitecommand.html
// https://github.com/awsdocs/aws-doc-sdk-examples/blob/master/javascriptv3/example_code/s3/src/s3_setbucketwebsite.ts

async function setupBacket() {
  const staticHostParams: PutBucketWebsiteRequest = {
    Bucket: CompressBacketName,
    WebsiteConfiguration: {
      IndexDocument: {
        Suffix: 'index.html', // the index document inserted into params JSON
      },
      RoutingRules: [
        {
          Condition: {
            HttpErrorCodeReturnedEquals: '404',
            KeyPrefixEquals: PREFIX + '/',
          },
          Redirect: {
            HttpRedirectCode: '302',
            HostName: 'functions.yandexcloud.net',
            Protocol: 'https',
            ReplaceKeyPrefixWith: `${FUNCTION_ID}?path=`,
          },
        },
      ],
    },
  };

  try {
    let data = await s3.send(new PutBucketWebsiteCommand(staticHostParams));

    // запросить и вывести правила переадресации
    data = await s3.send(new GetBucketWebsiteCommand({ Bucket: CompressBacketName }));
    console.log((data as any).RoutingRules);
  } catch (err) {
    console.error(err.message);
  }
}

setupBacket();

// примеры redirect
// https://docs.aws.amazon.com/AmazonS3/latest/userguide/how-to-page-redirect.html#redirect-rule-examples

/**
 * <p>The object key prefix to use in the redirect request. For example, to redirect requests
 *          for all pages with prefix <code>docs/</code> (objects in the <code>docs/</code> folder) to
 *             <code>documents/</code>, you can set a condition block with <code>KeyPrefixEquals</code>
 *          set to <code>docs/</code> and in the Redirect set <code>ReplaceKeyPrefixWith</code> to
 *             <code>/documents</code>. Not required if one of the siblings is present. Can be present
 *          only if <code>ReplaceKeyWith</code> is not provided.</p>
 */
// ReplaceKeyPrefixWith?: string;

/**
 * <p>The specific object key to use in the redirect request. For example, redirect request to
 *             <code>error.html</code>. Not required if one of the siblings is present. Can be present
 *          only if <code>ReplaceKeyPrefixWith</code> is not provided.</p>
 */
// ReplaceKeyWith?: string;
