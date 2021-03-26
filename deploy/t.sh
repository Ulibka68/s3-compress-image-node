#!/bin/sh
#export $(grep -v '^#' ./.env | xargs -d '\n')

cat main.env funcid.env > .env

