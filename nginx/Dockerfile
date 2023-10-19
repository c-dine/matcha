FROM debian:buster

RUN apt-get -y update \
&& apt-get -y install nginx


COPY conf/nginx.conf /etc/nginx/conf.d/default.conf 

EXPOSE 8080

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]