# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:18-alpine as builder
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci
# Build the app
RUN npm run build

FROM nginx:1.21.0-alpine as production

ENV NODE_ENV production
# Copy built assets from `builder` image
COPY --from=builder /app/dist /app/
# Add your nginx.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]

