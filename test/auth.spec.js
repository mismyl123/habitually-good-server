
const knex = require('knex')
const app = require('../src/app')
const AuthService = require('../src/auth/auth-service')

describe('Auth Endpoints', function () {
    let db;
    let testUser = [
        {
            id: 1,
            username: 'testuser',
            password: 'testuser'
        }
    ];

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.DATABASE_URL
        });
        app.set('db', db);
    });

    before('clean the tables before', () => db.raw('TRUNCATE TABLE habitually_users, habitually_habits, habitually_rewards RESTART IDENTITY CASCADE;'));
    afterEach('cleanup', () => db.raw('TRUNCATE TABLE habitually_users, habitually_habits, habitually_rewards RESTART IDENTITY CASCADE;'));
    after('disconnect from db', () => db.destroy());

    context(`Given 'users' has data`, () => {
        before(() => {
            return db
                .into('habitually_users')
                .insert(testUser)
        });
        it(`get user`, () => {
            return AuthService.getUserWithUserName(db, 'testuser')
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        username: 'testuser',
                        password: 'testuser'
                    })
                })
        })
    })
})