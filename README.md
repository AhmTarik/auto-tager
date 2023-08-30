# HackerNews Insights API service

### Prepare ENV variables

1. Create `.env` file - `cp ./dotenv ./.env`
2. Fill all env variables

## Docs

- [Getting Started](./docs/guide.md)
- [Connecting to MongoDB](./docs/mongo.md)
- [Protect your APIs with JWT Token](./docs/auth.md)
- [Dealing with model relations](./docs/model.md)
- [Externalizing the configuration](./docs/config.md)
- [Handling user registration](./docs/user.md)
- [Testing Nestjs applications](./docs/testing.md)

### Install dependencies

Use `npm install` to install required node packages from package.json .

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### SWAGGER

http://localhost:3000/swagger/

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
