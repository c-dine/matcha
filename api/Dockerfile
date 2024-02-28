FROM node:20.11.1

WORKDIR /app

COPY . .
RUN sed -i 's/"@shared-models\/\*": \["..\/shared-models\/\*"\]/"@shared-models\/\*": \[".\/src\/shared-models\/\*"\]/' ./tsconfig.json

RUN npm install
RUN npm install typescript nodemon


EXPOSE 3000

CMD ["npx", "nodemon"]
