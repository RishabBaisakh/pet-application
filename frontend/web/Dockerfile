# Dockerfile inside frontend/web/
FROM node:20-bullseye
WORKDIR /app

# Copy workspace package.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend code
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]