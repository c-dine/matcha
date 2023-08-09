FROM node:18

WORKDIR /app

COPY *.json ./

RUN npm install
RUN npm install typescript nodemon

COPY . .

EXPOSE 3000

CMD ["npx", "nodemon"]
