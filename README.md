# HABITUALLY-GOOD-SERVER

This is the backend server for Habitually Good client: frontend @ 
https://github.com/mismyl123/habitually-good-client

Live demo of app hosted on vercel:
https://habitually-good-client.vercel.app/

Live version of server hosted on heroku 
 https://damp-castle-21568.herokuapp.com/

Core Technologies

    Node.js
    PostgresSQL
    express.js
    JWT
    XSS

Services

    /users: GET, POST, PATCH
    /tasks: GET, POST, DELETE
    /rewards: GET, POST, DELETE

Local/Development Set-up

    Requirements: Node.js, npm, postgresql

1. Clone this repo
2. Set up database table as habitually:

$ createdb [connection-option...][option...] habitually
<<<<<<< HEAD
=======

>>>>>>> d53d1894787d119932530bc3c22f1d82f07c3bc1
3. Set up .env
        Must Include:
        NODE_ENV
        PORT
        MIGRATION_DB_HOST
        MIGRATION_DB_PORT
        MIGRATION_DB_NAME
        MIGRATION_DB_USER
        MIGRATION_DB_PASS
        DB_URL
        JWT_SECRET

4. Install node_modules and migrate:

.../habitually-server $ npm install
.../habitually-server $ npm run migrate

5. Seed database with sample data

.../habitually-server $ psql -d habitaually -f ./seeds/seed.habitually_tables.sql
