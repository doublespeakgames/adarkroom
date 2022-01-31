FROM nginx:alpine
LABEL "website.name"="aDarkRoom"
LABEL "website.url"="https://github.com/doublespeakgames/adarkroom"

#Copy static files to Nginx
COPY . /usr/share/nginx/html

WORKDIR /usr/share/nginx/html
EXPOSE 80/tcp
