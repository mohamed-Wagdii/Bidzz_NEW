# 1. Base Image
# We use node:20-alpine because it is very lightweight and secure.
FROM node:20-alpine

# 2. Working Directory
# Set the directory inside the container where our app will live.
WORKDIR /app

# 3. Copy package files
# We copy these FIRST before the rest of the code.
# Why? Docker caches layers. If package.json hasn't changed, 
# Docker will reuse the cached 'npm ci' layer, saving a lot of time on rebuilds!
COPY package*.json ./

# 4. Install Dependencies
# 'npm ci' (clean install) is better for production/CI than 'npm install'
# because it strictly installs exact versions from package-lock.json
# We add --omit=dev to avoid installing devDependencies (like nodemon).
RUN npm ci --omit=dev

# 5. Copy Source Code
# Now copy the rest of the application files into the container.
COPY . .

# 6. Expose Port
# Tell Docker which port the container listens on (from app.js basePort)
EXPOSE 5000

# 7. Start Command
# The command that starts your app when the container runs
CMD ["npm", "start"]
