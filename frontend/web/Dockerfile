# Use official Node image
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app code
COPY . .

# Expose port
EXPOSE 3000

# Start Next.js dev server
CMD ["npm", "run", "dev"]
