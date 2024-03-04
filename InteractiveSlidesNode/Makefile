core-build:
	npm run build:watch

api:
	PORT=5420 npm run start:watch

worker-default:
	PORT=5431 APP_TYPE=worker QUEUE_NAME=default npm run start:watch

worker-ocr:
	PORT=5435 APP_TYPE=worker QUEUE_NAME=vision-processing npm run start:watch

worker-etl:
	PORT=5433 APP_TYPE=worker QUEUE_NAME=wp-etl npm run start:watch
