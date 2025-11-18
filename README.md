# exam-gu-app
Projet Architecture des logiciels

## Lancer en local
cp .env.example .env
docker compose up -d

- MySQL : localhost:3306 (phpMyAdmin http://localhost:8080)
  DB: exam_app – scripts auto `mysql/init/*`
- Mongo : localhost:27017 (mongo-express http://localhost:8081)
  DB: exam_nosql – scripts auto `mongo/init/*`

## Rejouer l'init (reset complet)
docker compose down -v && docker compose up -d
