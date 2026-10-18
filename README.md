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

## API

All routes are mounted at the root of the API server (`http://localhost:1000`). Request bodies are JSON.

| Method | Route | Auth | Body | Response |
|--------|-------|------|------|----------|
| `POST` | `/auth/signup` | none | `name` (letters only, more than 5), `firstName`, `lastName`, `email`, `phone` (Egyptian mobile), `password`, `confirmpassword` | `{jwt: {token, expiresIn}, user}` |
| `POST` | `/auth/login` | none | `email`, `password` | `{jwt: {token, expiresIn}, user}` |
| `GET` | `/auth/me` | `Authorization: Bearer <token>` | | the signed-in user |
| `POST` | `/auth/forget-password` | none | `email` | emails a reset link to `FRONT_END_URL/reset-password/<token>` |
| `POST` | `/auth/reset-password` | `Authorization: Bearer <reset token>` | `password`, `confirmPassword` | `{message}` and a confirmation email |
| `POST` | `/message` | `Authorization: Bearer <token>` | `message` (non-empty) | `{message: "success"}`, stored with the sender's user id |
| `GET` | `/message` | `Authorization: Bearer <token>` | | `{count, rows}` of all messages |
| `GET` | `/images/<file>` | none | | uploaded images |

Errors come back as `{message, data}` with the error's status code; validation failures are 400 with the express-validator errors in `data`. Passwords must be alphanumeric and at least 5 characters.

## Tests

```bash
cd app
npm test   # node:test, Node 18+, no database needed
```

`test/upload.test.js` sends files through the real upload middleware and checks that only png/jpeg images are written to `images/`.

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
