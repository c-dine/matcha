FROM node:18

WORKDIR /app

COPY . .

RUN npm install -g @angular/cli

RUN npm install

RUN npm run build

CMD ["ng", "serve", "--host", "0.0.0.0"]

EXPOSE 8080