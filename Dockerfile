# Specify Base Image
FROM node:alpine

# Set working dir
WORKDIR /app

# add node modules to path
ENV PATH /app/node_modules/.bin:$PATH

# Install Dependencies
COPY ./package.json ./
RUN npm install npm@7.15.1
RUN npm update
RUN npm install yarn
RUN yarn install

# Copy files
COPY ./ ./

# Default Commands
CMD ["yarn", "start"]