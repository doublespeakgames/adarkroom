FROM alpine:latest

# Install nginx
RUN apk add --no-cache nginx

# Create necessary directories
RUN mkdir -p /run/nginx /var/www/html

# Copy the web application files
COPY --exclude=Dockerfile --exclude=docker-entrypoint.sh --exclude=.git . /var/www/html/

# Create nginx configuration
RUN echo 'server {' > /etc/nginx/http.d/default.conf && \
    echo '    listen 80 default_server;' >> /etc/nginx/http.d/default.conf && \
    echo '    listen [::]:80 default_server;' >> /etc/nginx/http.d/default.conf && \
    echo '    root /var/www/html;' >> /etc/nginx/http.d/default.conf && \
    echo '    index index.html;' >> /etc/nginx/http.d/default.conf && \
    echo '    location / {' >> /etc/nginx/http.d/default.conf && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/http.d/default.conf && \
    echo '    }' >> /etc/nginx/http.d/default.conf && \
    echo '}' >> /etc/nginx/http.d/default.conf

# Expose Nginx Port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]