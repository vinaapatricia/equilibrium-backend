FROM node:18-alpine as build

WORKDIR /app
COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm","start"]