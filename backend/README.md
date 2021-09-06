# priceparser sharing app webservices

## DB Setup
* Install Postgresql
```
* with homebrew
brew install postgresql
createdb wishcheaper

# or with docker
docker run --name promo-postgres -p 5432:5432 -e POSTGRES_USER=$USER -e POSTGRES_DB=wishcheaper -e POSTGRES_PASSWORD=postgres -d postgres:10
```

* Apply database migrations
```
npm run db-latest
```

## Env Setup

Create `.env` file with db connection string and desired port:

    DATABASE_URL="postgresql://localhost:5432/wishcheaper"
    PORT=4000
    NODE_ENV=dev
