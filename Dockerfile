# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=18.20.4

FROM node:${NODE_VERSION}-alpine

# Use development node environment for running Expo web dev server.
ENV NODE_ENV=development


WORKDIR /usr/src/app

COPY package*.json ./
# Install all dependencies including devDependencies (Expo web needs webpack config at runtime)
RUN npm install --legacy-peer-deps

# Copy the rest of the source files into the image.
COPY . .

# Ensure project files (including .expo cache dir) are writable by the non-root user
RUN chown -R node:node /usr/src/app

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 19006

# Run the application.
CMD ["npm", "run", "web"]
