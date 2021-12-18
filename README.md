P R O M O
---------

# Technologies used
!nodejs 9.x.x

Frontend:
* react
* react-router 4
* redux
* semantic ui

Backend:
* express (NodeJS)
* postgresql

# How to develop

* install postgresql and create database named `wishcheaper`:
```
# with homebrew
brew install postgresql
createdb wishcheaper

# or with docker
docker run --name promo-postgres -p 5432:5432 -e POSTGRES_USER=$USER -e POSTGRES_DB=wishcheaper -d postgres:10
```

* configure it in /backend/knexfile.js
```
database: 'wishcheaper',
user: process.env.USER,
password: ''
```
* install packages for both frontend and backend applications:
```
cd frontend
yarn install
...
cd backend
yarn install
```
* apply database migrations
```
cd backend
npm run db-latest
```
these migrations can be rolled back and edited, if required with ` npm run db-rollback`, after what they may be applied again

* run backend app
```
cd backend
yarn dev
```

* run frontend app
```
cd frontend
yarn start
```

# Dev .env config vars
* /backend/.env
```
DATABASE_URL="postgresql://localhost:5432/wishcheaper"
PORT=4000
NODE_ENV=dev
JWT_SECRET=secret_key
VK_SECRET_KEY=zNrFM3EPU9nmqA4g8UQs
VK_COMMUNITY_KEY=zdf809d2adf809d2adf809d243ad936aa1aadf8adf809d2f0ef7a04987feb44c538a699
VK_API_VERSION=5.87

```
* /frontend/.env.local
```
PORT=3000
REACT_APP_VK_APP_ID=7037811
REACT_APP_VK_SERVICE_KEY=adf809d2adf809d2adf809d243ad936aa1aadf8adf809d2f0ef7a04987feb44c538a699
REACT_APP_VK_API_VERSION=5.87
REACT_APP_VK_COMMUNITY_ID=183947186
```

* have fun?