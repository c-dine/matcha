FROM node:23

WORKDIR /app

COPY . .
RUN sed -i 's/"@shared-models\/\*": \["..\/shared-models\/\*"\]/"@shared-models\/\*": \[".\/src\/shared-models\/\*"\]/' ./tsconfig.json

RUN npm install -g @angular/cli

RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll=2000", "--port", "4200", "--disable-host-check"]

EXPOSE 8080