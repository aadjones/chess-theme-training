FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
COPY backend/package*.json ./backend/

RUN npm run setup

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"] 