# Use an official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose port (match whatever port your app uses)
EXPOSE 8000

# Start the app (change if different)
CMD ["node", "dist/index.js"]
