FROM node:20

WORKDIR /app

EXPOSE 4000

COPY package*.json ./

COPY uploads /app/uploads

RUN npm install

COPY . .

COPY .env ./

CMD ["npm", "run", "start"]