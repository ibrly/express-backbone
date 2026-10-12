# express-backbone

An Express.js backbone for user authentication, user management and real-time chat, built on Sequelize (MySQL), Passport bearer auth, express-validator and Socket.io.

## Features

- Sign up, sign in, forgot and reset password (SendGrid emails)
- JWT bearer authentication and an admin middleware
- User CRUD through a repository layer (`app/api/user/repository`)
- Image uploads with multer
- Real-time chat over Socket.io (`app/api/message`)
- Centralised error handling and response helpers
- Winston logging
- Swagger UI from `app/swagger.json`

## Getting started

```bash
cp env/app.env.example env/app.env
cp env/db.env.example env/db.env
# fill in the passwords, JWT_PRIVATE_KEY and SENDGRID_API_KEY

docker compose up --build
```

The API listens on `http://localhost:1000`, the chat Socket.io server on `http://localhost:3011` (`SOCKET_PORT`), and MySQL is exposed on `localhost:6603`.

### Without Docker

```bash
cd app
npm install
npm start
```

## Project layout

```
app/
├── api/
│   ├── user/        # controllers, routes, validations, repository, middlewares
│   └── message/     # chat controllers, model and routes
├── exceptionHandler/
├── services/        # response and error helpers, token utilities
├── util/            # database, logging, mailer, upload config
├── routes.js
└── index.js         # entry point
```
