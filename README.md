# cda-blablabook

## Instalation

add .env

run npm i

run npx prisma migrate dev

## Neon

- Récupérer l'url de la database Neon
- Remplacement la DATABASE_URL dans le .env et dans le docker compose
- Relancer le docker afin qu'il prenne en compte la nouvelle URL
- Si c'est la 1ère fois :
  --> dans le container back end : npx prisma generate + npx prisma db push + npx prisma db seed



## CI/CD

VPS_HOST = patignierthomas-server.eddi.cloud
VPS_PORT = 22
VPS_USER = student

// chargement du dump
docker exec -i <vps_postgres_container> psql -U <DB_USER> <DB_NAME> < dumpSql/dev-dump.sql