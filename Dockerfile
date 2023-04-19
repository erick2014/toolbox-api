# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy all files to the container
COPY . .

# Set the environment variable for Node.js
ENV NODE_ENV=production

# Expose the port that the container will listen on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
