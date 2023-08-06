FROM node:18

WORKDIR /app

COPY . .

RUN npm install -g @angular/cli

RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll=2000", "--port", "4200", "--disable-host-check"]

EXPOSE 8080