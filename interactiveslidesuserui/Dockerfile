FROM --platform=linux/amd64 node:18-alpine as builder
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# ==== BUILD =====

RUN apk add --update --no-cache python3 g++ make py3-pip && ln -sf python3 /usr/bin/python
#RUN pip3 install --no-cache --upgrade pip setuptools


RUN yarn install --production=true

# Build the app
RUN yarn build

FROM --platform=linux/amd64 nginx:1.21.0-alpine as production

ENV NODE_ENV production
# Copy built assets from `builder` image
COPY --from=builder /app/build /app/
# Add your nginx.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]

