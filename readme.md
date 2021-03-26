# Сжатие изображение с помощью библиотеки sharp

## Установка
### Важно:
Дай права на запуск для скриптов в папке deploy

1. скопировать example.env в main.env  
2. из корня запустить:

./deploy/first-setup-func.sh  
./deploy/deploy.sh

Будет создан файл .env в котором будет FUNCTION_ID

first-setup-func.sh  создает функцию на Яндекс, делает ее публичной

Запускается все это только под Windows wsl (bash)
