FROM node

WORKDIR /app

COPY package.json .

RUN npm install


COPY . .

CMD ['npm', 'run', 'build']

EXPOSE 1337

CMD ["npm","run" ,"develop"]
