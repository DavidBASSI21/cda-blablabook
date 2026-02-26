FROM node:24-alpine3.21

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install --ignore-scripts

COPY . .

RUN mkdir -p uploads/profiles

EXPOSE 3000

RUN npx prisma generate 

CMD ["npm", "run", "start:dev"]