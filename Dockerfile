FROM node:10.16.0

# Create app dir
WORKDIR /usr/src/app

# Copy package*.json
COPY package*.json  ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

RUN npm ci --only=production

COPY . .
RUN ["npm", "run", "installProd"]

RUN ["npm", "run", "build"]

CMD [ "npm", "start" ]