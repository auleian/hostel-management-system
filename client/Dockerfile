# Stage 1: Build the Vite app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy the rest of the application code
COPY . .

ARG VITE_API_BASE_URL
# Write Vite env file (overwrite to avoid accidental concatenation). Use printf to ensure trailing newline.
RUN printf "VITE_API_BASE_URL=%s\n" "${VITE_API_BASE_URL:-https://hostelmanagementapi-dev.onrender.com/api}" > .env


# Build the Vite app
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80