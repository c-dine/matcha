FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install typescript

COPY . .

RUN npx tsc

EXPOSE 3000

CMD ["node", "./dist/app.js"]
