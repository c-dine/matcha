FROM postgres:15.3

COPY ./init.sql /docker-entrypoint-initdb.d/init.sql

RUN chmod +x /docker-entrypoint-initdb.d/init.sql

EXPOSE 5432