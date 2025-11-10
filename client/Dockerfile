# Stage 1: Build the Vite app
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

ARG VITE_API_BASE_URL
RUN echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" >> .env


# Build the Vite app
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80