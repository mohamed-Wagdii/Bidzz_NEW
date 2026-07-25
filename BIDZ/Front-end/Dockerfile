# ==========================================
# Stage 1: Build the React/Vite application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
# Using npm ci for a clean, reliable install
RUN npm ci

# Copy the rest of the frontend code
COPY . .

# Build the app for production (creates a 'dist' folder)
RUN npm run build

# ==========================================
# Stage 2: Serve with Nginx
# ==========================================
# We use nginx alpine as it's very lightweight
FROM nginx:alpine

# Copy the built output from the 'builder' stage to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration to handle React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
