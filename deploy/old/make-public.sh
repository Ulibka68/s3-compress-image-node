#!/bin/sh
#source ../.env
export $(grep -v '^#' ../.env | xargs -d '\n')

echo "сделать функцию публичной $FUNCTION_NAME"
#yc serverless function list-access-bindings $FUNCTION_NAME  --folder-id $FOLDER_ID
yc serverless function allow-unauthenticated-invoke $FUNCTION_NAME  --folder-id $FOLDER_ID

