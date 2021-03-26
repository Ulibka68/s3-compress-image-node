copy package.json .\dist\package.json
cd .\dist
yc serverless function version create --folder-id b1gt  --function-name=func1 --runtime nodejs14   --entrypoint index.handler   --memory 256m   --execution-timeout 30s   --source-path . --service-account-id=ajerm5ol --environment AWS_ACCESS_KEY_ID=EMH,AWS_SECRET_ACCESS_KEY=6x2t5,AWS_REGION="ru-central1",AWS_ENDPOINT="https://storage.yandexcloud.net",COMPRESSBACKETNAME=compress-1a333b
