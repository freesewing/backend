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

## API Cheat sheet
With authentication:

|🔐| Method | Endpoint | Description |
|--- |--------|----------|-------------|
|🔐|`POST`|`/models`| [Creates model](#create-model) |
|🔐|`GET`|`/models/:handle`| [Read model](#read-model) |
|🔐|`PUT`|`/models/:handle`| [Update model](#update-model) |
|🔐|`DELETE`|`/models/:handle`| [Remove model](#remove-model) |
|🔐|`POST`|`/recipes`| [Create recipe](#create-recipe) |
|🔐|`GET`|`/recipes/:handle`| [Read recipe](#read-recipe) |
|🔐|`PUT`|`/recipes/:handle`| [Updates recipe](#update-recipe) |
|🔐|`DELETE`|`/recipes/:handle`| [Remove recipe](#remove-recipe) |
|🔐|`GET`|`/account`| [Load account](#load-account) |
|🔐|`PUT`|`/account`| [Update account](#update-account) |
|🔐|`DELETE`|`/account`| [Remove account](#remove-account) |
|🔐|`POST`|`/account/change/email`| [Confirm email change](#confirm-email-change) |
|🔐|`GET`|`/account/export`| [Export account](#export-account) |
|🔐|`GET`|`/account/restrict`| [Restric account](#restrict-account) |
|🔐|`GET`|`/users/:username`| [Read user profile](#read-user-profile)
|🔐|`POST`|`/available/username`| [Is username available](#is-username-available) |

Without authentication:

|🔓| Method | Endpoint | Description |
|--- |--------|----------|-------------|
|🔓|`POST`|`/signup`| [Request account](#request-account) |
|🔓|`POST`|`/signup`| [Create account](#create-account) |
|🔓|`POST`|`/login`| [Log in](#log-in) |
|🔓|`POST`|`/reset/password`| [Recover password](#recover-password) |
|🔓|`POST`|`/confirm/login`| [Passwordless login](#passwordless-login) |
|🔓|`POST`|`/oauth/init`| [Oauth initialisation](#oauth-initialisation) |
|🔓|`GET`|`/oauth/callback/from/:provider`| [Oauth callback](#oauth-callback) |
|🔓|`POST`|`/oauth/login`| [Oauth login](#oauth-login) |
|🔓|`GET`|`/patrons`| [Paton list](#patron-list) |

## Authentication

This API uses [JWT](https://jwt.io/) for authentication. Authenticated calls to this API should include a `Authorization` header as such:

```
Authorization: Bearer <token>
```

The `token` is returned from the `/login`, `/oauth/login`, and `/confirm/login` endpoints.

## API Reference

### Models
#### Create model

```
POST /models
{
  'name': 'The model name',
  'breasts': false,
  'units': 'imperial'
}
```  
On success:
```
200
{
  'model': {   
    'breasts': false,
    'units': 'imperial',
    'handle': 'dnkve',
    'user': 'ohium',
    'name': The model name',
    'createdAt': '2019-08-12T12:06:41.086Z',
    'updatedAt': '2019-08-12T12:06:41.086Z',
    'pictureUris': {
      'l': 'https://static.she.freesewing.org/users/o/ohium/models/dnkve/dnkve.svg',
      'm': 'https://static.she.freesewing.org/users/o/ohium/models/dnkve/dnkve.svg',
      's': 'https://static.she.freesewing.org/users/o/ohium/models/dnkve/dnkve.svg',
      'xs': 'https://static.she.freesewing.org/users/o/ohium/models/dnkve/dnkve.svg'
    }
  }
}
```
On failure:
```
400
```

Creates a model and returns its data.

#### Read model
```
GET /models/:handle
```
On success: The model data
On failure:
```
400
```

Loads a model's data

#### Update model

```
PUT /models/:handle
{
  'measurements': {
    'ankleCircumference': 234
  }
}
```

Updates the model and returns the (updated) model data.

#### Remove model

```
DELETE /models/:handle
```
On success:
```
200
```
On failure:
```
400
```

Removes the model

### Recipes
#### Create Recipe

```
POST /recipes
{
  'name': 'The recipe name',
  'notes': 'Some notes',
  'recipe': {
    'settings': {
      'sa': 10,
      'complete': true,
      'paperless': false,
      'units': 'metric',
      'measurements': {
        'bicepsCircumference': 335,
        'centerBackNeckToWaist': 520,
        'chestCircumference': 1080,
        '"naturalWaistToHip': 145,
        'neckCircumference': 420,
        'shoulderSlope': 55,
        'shoulderToShoulder': 465,
        'hipsCircumference': 990
      }
    },
    'pattern': 'aaron',
    'model': 'dvqye'
  }
}
```  
On success:
```
200
{
  'handle': 'abxda'
}
```
On failure:
```
400
```

Creates a recipe and returns its data.

#### Read recipe
```
GET /recipes/:handle
```
On success: The recipe data
On failure:
```
400
```

Loads a recipe's data

#### Update recipe

```
PUT /recipes/:handle
{
  'notes': "5 stars, would make again"
}
```

Updates the recipe and returns the (updated) recipe data.

#### Remove recipe

```
DELETE /recipes/:handle
```
On success:
```
200
```
On failure:
```
400
```

Removes the recipe

### Account
#### Load account
```
GET /account
```
On success: The account data
On failure:
```
400
```

#### Update account
```
PUT /account
{
  'bio': 'The new bio',
  'avatar': 'data:image/png;base64,iVBORw0KGg...'
  'password': 'new password',
  'username': 'new username',
  'email': 'new.email@domain.com',
  'social': {
    'github': 'githubUsername',
    'twitter': 'twitterUsername',
    'isntagram': 'instagramUsername'
  },
  'settings': {
    'language': 'fr',
    'units': 'imperial',
  },
  'consent': {
    'profile': true,
    'model': false,
    'openData': false
  },
```
On success: The (updated) account data
On failure:
```
400
```
 - This will only update what you pass it
 - This will only handle one top-level attribute per call
 - A change of email won't take effect immediately but instead trigger an email for confirmation. The email will be sent to the new email address, with the current email address in CC.

#### Remove account
```
DELETE /account
```
On success:
```
204
```
On failure:
```
400
```

Removes the account and all user's data. Will also trigger a goodbye email.

#### Confirm email change
```
POST /account/change/email
{
  'id': '98e132041ad3f369443f1d3d'
}
```
On success: The account data
On failure:
```
400
```

Changing your email address requires confirmation, and this endpoint is for that.

#### Export account
```
GET /account/export
```
On success: 
```
200
{ 
  'export': 'https://static.freesewing.org/tmp/msypflkyyw/export.zip' 
}
```
On failure:
```
400
```

Will export the user data and publish it for download. 

#### Restrict account
```
GET /account/restrict
```
On success:
```
200
```
On failure:
```
400
```

Will lock the user account, thereby restricting processing of their data.

### Users
#### Read user profile
```
GET /users/:username
```
On success:
```
200
{ 
  'settings': { 
    'language': 'en', 
    'units': 'metric' 
  },
  'patron': 0,
  'bio': '',
  'handle': 'rracx',
  'username': 'admin',
  'createdAt': '2019-08-12T07:40:32.435Z',
  'updatedAt': '2019-08-12T09:23:48.930Z',
  'pictureUris': { 
    'l': 'https://static.she.freesewing.org/users/r/rracx/rracx.svg',
    'm': 'https://static.she.freesewing.org/users/r/rracx/rracx.svg',
    's': 'https://static.she.freesewing.org/users/r/rracx/rracx.svg',
    'xs': 'https://static.she.freesewing.org/users/r/rracx/rracx.svg' 
  } 
}
```

Load the profile data of a user. It expects one parameter in the URL of the `GET` request:

| Variable   | Description |    
|------------|-------------|                                 
| `username` | The username of the user to load the profile data for |

#### Is username availbable
  
```
POST /available/username
{
  username: 'username to check'
}
```
Username available:
```
200
```
Username not available:
```
400
```

#### Patron list

```
GET /patrons
```
On success:
```
200
{
  '2': [
  ], 
  '4': [], 
  '8': [
    {
      'handle': 'joost',
      'username': 'joost',
      'bio':"If something doesn't work around here, that's probably my fault",
      'social': {
        'twitter': 'j__st',
        'instagram': 'joostdecock',
        'github': 'joostdecock'
      },
      'pictureUris': {
        'l': 'https://static.freesewing.org/users/j/joost/joost.jpg',
        'm': 'https://static.freesewing.org/users/j/joost/m-joost.jpg',
        's': 'https://static.freesewing.org/users/j/joost/s-joost.jpg',
        'xs': 'https://static.freesewing.org/users/j/joost/xs-joost.jpg'
      }
    }
  ] 
}
```

- Retrieves the list of [FreeSewing patrons](https://en.freesewing.org/patrons).
- Returns an array per tier

### Sign up
#### Request account
```
POST /signup
{
  email: 'test@freesewing.org',
  password: 'test',
  language: 'en'
}
```
On success: 
```
200 
```
On error:
```
400 
```

 - This is the first half in the user sign up flow. 
 - `language` should be one of the [configured language codes](https://github.com/freesewing/backend/blob/develop/src/config/index.js#L32)
 - This will create (but not activate) a user account
 - This will send out an email to the user to confirm their email address

#### Create account
```
POST /account
{
  id: '5d5132041ad3f369443f1d7b'
  consent: {
    profile: true,
    model: true,
    openData: true
  }
}
```
On success: The account data:
```
200
{ 
  'account': { 
    'settings': { 
      'language': 'en', 
      'units': 'metric' 
    },
    'consent': { 
      'profile': true,
      'model': true,
      'openData': true,
    },
    'time': { 
      'login': '2019-08-12T09:41:15.823Z' 
    },
    'role': 'user',
    'patron': 0,
    'bio': '',
    'picture': 'csfwg.svg',
    'status': 'active',
    'handle': 'csfwg',
    'username': 'user-csfwg',
    'email': 'test@freesewing.org',
    'pictureUris': { 
      'l': 'https://static.freesewing.org/users/c/csfwg/csfwg.svg',
      'm': 'https://static.freesewing.org/users/c/csfwg/csfwg.svg',
      's': 'https://static.freesewing.org/users/c/csfwg/csfwg.svg',
      'xs': 'https://static.freesewing.org/users/c/csfwg/csfwg.svg' 
    } 
  },
  'models': {},
  'recipes': {},
  'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDUxMzQzYjFhZDNmMzY5NDQzZjFkOTYiLCJoYW5kbGUiOiJjc2Z3ZyIsImF1ZCI6ImZyZWVzZXdpbmcub3JnIiwiaXNzIjoiZnJlZXNld2luZy5vcmciLCJpYXQiOjE1NjU2MDI4NzV9.-u4qgiH5sEcwhSBvQ9AOxjqsJO3-Phm9t7VbPaPS7vs' 
}
```
On failure:
```
400 
```

This is the second half of the sign up flow. The email sent to the user in the first half of the sign up flow contains a link to the (frontend) confirmation page. This will get the confirmation ID from the URL and `POST` it to
the backend, along with the user's choices regarding consent  for processing their personal data.

The `consent` object has the following properties:
  - `bool profile` : Consent for the processing of profile data
  - `bool model` : Consent for the processing of model data
  - `bool openData` : Whether or not the user allows publishing of measurements as open data 

For more details on user consent, please consult [FreeSewing's privacy notice](https://en.freesewing.org/docs/about/privacy).

> Note: Our frontend won't allow users to proceed without profile consent as
> storing your data requires that consent. The backend enforces this too

### Log in
```
POST /login
{
  'username': 'user-csfwg',
  'password': `test`
}
```
On success: The account data
On failure:
```
400
```
 - Returns the same as the create account endpoint
 - Both username or email address can be uses as `username`

#### Reset password
```
POST /reset/password
{
  'username': 'test@freesewing.org'
}
```
On success:
```
200
```
On failure:
```
400
```

 - Will send an email to the user with a link for a passwordless login. 

#### Passwordless login
```
POST /confirm/login
{
  'id': '5d5132041ad3f369443f1d7b'
}
```
On success: The account data
On failure:
```
400
```
 - Returns the same as the create account endpoint
 - ID is the one sent out in the confirmation email

This will log the user in.

### Oauth
#### Oauth initialisation
```
POST /oauth/init
{
  'provider': 'github',
  'language': 'fr'
}
```
On success:
```
200
{
  'state': '5d5132041ad3f369443f1d7b'
}
```
On failure:
```
400
```
 - This triggers an Oauth flow
 - `provider` should be one of `google` or `github`
 - `language` should be one of the [configured language codes](https://github.com/freesewing/backend/blob/develop/src/config/index.js#L32)
 - The frontend will use the state value to initialize an Oauth session. We'll check the state value when we receive the Oauth callback at the backend

#### Oauth callback
```
GET /oauth/callback/from/:provider
```
On success: Redirects to the frontend

This is part of the Oauth flow. It fetches the user info from the Oauth provider. If it can't match it with a user, it will create a user account.  
In other words, this will handle both log in and sign up.

The frontend redirect will contain a confirmation ID in the URL that we'll `POST` back in the next Oauth flow step.

#### Oauth login
```
POST /oauth/login
{
  'confirmation': '98e132041ad3f369443f1d3d'
}
```
On success: The account data
On failure:
```
400
```

This is the last step of the Oauth process. It logs a user in.


## Tests

There's two ways to run tests:

 - `npm run test` will run tests that don't depend on emails
 - `npm run testall` will runn all tests, including the ones that depend on email

To run the email tests, spin up a mailhog container with Docker:

```
sudo docker run -p 8025:8025 -p 1025:1025 mailhog/mailhog
```

Then, configure your backend as such:

`FS_SMTP_HOST` : `localhost` (this makes sure emails go to mailhog)
`FS_SMTP_PORT` : `1025` (the mailhog port)

This allows complete end-to-end testing of signup flow and other things the depend on email sent to the user.


## Links

- 💻 Maker site: [freesewing.org](https://freesewing.org)
- 👩‍💻 Developer site: [freesewing.dev](https://freesewing.dev)
- 💬 Chat/Support: [Gitter](https://gitter.im/freesewing/freesewing)
- 🐦 Twitter: [@freesewing_org](https://twitter.com/freesewing_org)
- 📷 Instagram: [@freesewing_org](https://instagram.com/freesewing_org)

## License

Copyright (c) 2019 Joost De Cock - Available under the MIT license.

See the LICENSE file for more details.
