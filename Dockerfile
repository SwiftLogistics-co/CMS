FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the rest of the application files
COPY . .

COPY .env .env

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]