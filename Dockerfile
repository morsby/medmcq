FROM node:12.16.1

WORKDIR /usr/src/app

# Dont skip this step. It is for caching.
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN npm run install-all

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]