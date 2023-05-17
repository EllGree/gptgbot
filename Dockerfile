# The latest nodejs image
FROM node:latest

# Create and set the working directory
WORKDIR /app

# Copy the package.json file to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy the rest of the app files to the working directory
COPY . .

# Set environment variable PORT for the Telegram bot
ENV PORT=3000

# Expose the default port for the Telegram bot
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]
