#!/bin/sh
#source ../.env
export $(grep -v '^#' ./.env | xargs -d '\n')


echo "npx tsc --build tsconfig.json"
npx tsc --build tsconfig.json
pwd
cp package.json ./dist/package.json


echo "Создание версии функции $FUNCTION_NAME"
yc serverless function version create \
  --function-name=$FUNCTION_NAME \
  --runtime nodejs14 \
  --entrypoint index.handler \
  --memory 256m \
  --execution-timeout 8s \
  --source-path ./dist \
  --service-account-id=$SERVICE_ACCOUNT_ID \
  --folder-id $FOLDER_ID \
  --environment AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY,AWS_REGION="ru-central1",AWS_ENDPOINT="https://storage.yandexcloud.net",COMPRESSBACKETNAME=$COMPRESSBACKETNAME

