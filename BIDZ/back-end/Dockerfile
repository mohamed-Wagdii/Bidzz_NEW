# Base Image

FROM node:22-alpine

#Work Dir 

WORKDIR /app

#COPY Package files //

COPY package*.json ./

# Install Dependencies
RUN npm install 
#Copy Source Code

COPY . .

# EXPOSE PORT

EXPOSE 5000

# Start Command
CMD ["npm", "start"]
