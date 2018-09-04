# Token based user autentication in Nodejs

Using [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) package to implement token based authentication on a simple Node.js API with Email support.

## Requirements

- node and npm

## Usage

1. Clone the repo: `git clone https://github.com/heriagape/token-user-auth.git`
2. Install dependencies: `npm install`
3. Rename `config-EXAMPLE.js` to `config.js`
4. Change SECRET in and Add your own MongoDB database to `config.js`
5. Start the server: `npm start`
6. Create sample user by visiting: `http://localhost:8080/setup`

Once everything is set up, we can begin to use our app by creating and verifying tokens.

### Getting a Token

Send a `POST` request to `http://localhost:8080/api/authenticate` with test user. 

```javascript
  {
    email: 'agape@live.fr',
    password: 'password'
  }
```
or
```javascript
  {
    username: 'heriagape',
    password: 'password'
  }
```

### User Registration

Send a `POST` request to `http://localhost:8080/api/create`. 

```javascript
  {
    name: 'Peter Kamau',
    username: 'peter',
    email: 'peter@mail.com',
    password: 'password'
  }
```

### Verifying a Token and Listing Users

Send a `GET` request to `http://localhost:8080/api/check` with a header parameter of `x-access-token` and the token.

You can also send the token as a URL parameter: `http://localhost:8080/api/users?token=YOUR_TOKEN_HERE`

Or you can send the token as a POST parameter of `token`.
