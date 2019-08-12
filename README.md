![FreeSewing: A JavaScript library for made-to-measure sewing patterns](https://en.freesewing.org/banner.jpg)

# FreeSewing / backend

This is the backend for [FreeSewing.org](https://freesewing.org/), our maker site.

Our backend is a REST API built with [Express](https://expressjs.com/),
using [MongoDB](https://www.mongodb.com/) as our database.

## About

This backend handles the storage and retrieval of user data. Including:

 - User profiles
 - Models
 - Recipes

This backend does not include any code related to our patterns. 
It is only required if you want to use your own instance
of [freesewing.org](https://github.com/freesewing/backend).

## Getting started

To start this backend, you'll need:

 - A MongoDB database
 - Configure environment variables (see [configuration](#configuration) below)

There's a few different ways you can get started:

### Using our docker image and your own database

If you just want the backend and provide your own mongo instance,
you can run [our docker image](https://hub.docker.com/r/freesewing/backend) directly
from the internet:

```
docker run --env-file .env --name fs_backend -d -p 3000:3000 freesewing/backend
```

Your backend will now be available at http://localhost:3000

### Using docker-compose

You can use [docker-compose](https://docs.docker.com/compose/) to spin up both the backend
API and a MongoDB instance. Clone the repository, and run `docker-compose up`:

```
git clone git@github.com:freesewing/backend.git
cd backend
docker-compose up
```

Your backend will now be available at http://localhost:3000

### Run from source

To run the backend from source, you'll need to clone this repository
and intall dependencies.

```
git clone git@github.com:freesewing/backend
cd backend
npm install
npm install --global backpack-core
```

> Note that we're installing [backpack-core](https://www.npmjs.com/package/backpack-core) globally for ease-of-use

While developing, you can run:

```
npm run develop
```

And backpack will compile the backend, and spin it up.
It will also watch for changes and re-compile every time. Handy!

If you want to run this in production, you should build the code:

```
npm run build
```

Then use something like [PM2](http://pm2.keymetrics.io/) to run it and keep it running.

## Configuration

This backend can be configured with environment variables. 
We provide an `example.env` file that you can edit and rename to `.env`.


| Variable                  | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `FS_BACKEND`              | URL on which the backend is hosted               |
| `FS_SITE`                 | URL on which the frontend is hosted              |
| `FS_MONGO_URI`            | URL for the Mongo database                       |
| `FS_ENC_KEY`              | Secret used for encryption of data at rest       |
| `FS_JWT_ISSUER`           | The JSON Web Token issuer                        |
| `FS_SMTP_HOST`            | SMTP relay through which to send outgoing emails |
| `FS_SMTP_USER`            | SMTP relay username                              |
| `FS_SMTP_PASS`            | SMTP relay password                              |
| `FS_GITHUB_CLIENT_ID`     | Github client ID for signup/login via GitHub     |
| `FS_GITHUB_CLIENT_SECRET` | Github client ID for signup/login via GitHub     |
| `FS_GOOGLE_CLIENT_ID`     | Google client ID for signup/login via Google     |
| `FS_GOOGLE_CLIENT_SECRET` | Google client ID for signup/login via Google     |


Our [example.env]() file has more details.

## Tests

There's two ways to run tests:

 - `npm run test` will run tests that don't depend on emails
 - `npm run testall` will runn all tests, including the ones that depend on email

To run the email tests, spin up a mailhog container with Docker:

```
sudo docker run -p 8025:8025 -p 1025:1025 mailhog/mailhog
```

Then, configure your backend as such:

`FS_SMTP_USER` : `user` (doesn't matter what you use)
`FS_SMTP_PASS` : `password` (doesn't matter what you use
`FS_SMTP_HOST` : `localhost` (this makes sure emails go to mailhog)
`FS_SMTP_PORT` : `1025` (the mailhog port)

This allows complete end-to-end testing of signup flow and other things the depend on email sent to the user.

## API Reference

### Anonymous endpoints

#### User

##### Sign up

`POST /signup`

##### Create account

`POST /user

##### Login

`POST /login`

##### Passwordless login

`POST /confirm/login`

##### Reset password

`POST /reset/password`

##### Set user password after reset

`POST /set/password`

#### Oauth

##### Oauth initialisation

`POST /oauth/init`

##### Oauth callback

`GET /callback/from/:provider`

##### Oauth login

`POST /oauth/login`

#### Various

`GET /patrons`

### Authenticated endpoints

#### User

##### Load account (own data)

`GET /account`

##### Load profile (other user's data)

`GET /user/:username`

##### Update account

`PUT /user`

##### Remove account

`DELETE /user`

##### Confirm email change

`POST /confirm/changed/email`

##### Export data

`GET /export`

##### Restrict processing of personal data

`GET /restrict`

#### Various

##### FIXME

`POST /confirm`

##### Check whether username is available
  
`POST /available/username`

#### Models

##### Create model

`POST /model`

##### Read model

`GET /model`

##### Update model

`PUT /model`

##### Remove model

`DELETE /model`

#### Recipes

##### Create recipe

`POST /recipe`

##### Read recipe

`GET /recipe`

##### Update recipe

`PUT /recipe`

##### Remove recipe

`DELETE /recipe`


## Links

- 💻 Maker site: [freesewing.org](https://freesewing.org)
- 👩‍💻 Developer site: [freesewing.dev](https://freesewing.dev)
- 💬 Chat/Support: [Gitter](https://gitter.im/freesewing/freesewing)
- 🐦 Twitter: [@freesewing_org](https://twitter.com/freesewing_org)
- 📷 Instagram: [@freesewing_org](https://instagram.com/freesewing_org)

## License

Copyright (c) 2019 Joost De Cock - Available under the MIT license.

See the LICENSE file for more details.
