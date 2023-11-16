# Use an official Node runtime as the base image
FROM node:18.16-alpine3.18

RUN apk add --no-cache mysql-client curl

# Set the working directory in the container
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Run the app when the container launches
CMD [ "npm", "run", "start" ]
