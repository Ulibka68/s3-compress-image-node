yc apigatewayv2 get-apis

https://api.cloud.yandex.net/endpoints

# Создание профиля

### Создать токен
https://oauth.yandex.ru/verification_code#access_token=AQAAAAAYaPvxAATuwd6ug_aGFE6DhcuxLw_f-z0&token_type=bearer&expires_in=31366793

yc init
yc config profile create as006

yc config set folder-id b1gtg517
yc config set --token AQAAAAAYaPvxAATuwd

yc config set cloud-id b1gccpjuptmu1eg0c2ao
yc config profile get as006

### установить парсер json
sudo apt-get install jq

sudo adduser gayrat

# Запускать из корня
./deploy/first-setup-func.sh
./deploy/deploy.sh


