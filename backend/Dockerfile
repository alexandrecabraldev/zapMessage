FROM node:18-alpine

WORKDIR /src/backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3333

CMD ["npm", "run", "start:back"]