const { default: expectCt } = require('helmet/dist/middlewares/expect-ct');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const RewardsService = require('../src/rewards/rewards-service');

describe('Habits with Rewards Endpoint', function () {
    let db;

    function makeHabitsArray() {
        return [
            {
                id: 1,
                text: 'New Habit',
                due_date: "2020-12-01"
              }
        ]
    };

    function makeUserArray() {
        return [
            {
                id: 1,
                username: 'testtheuserpls',
                password: '$2a$12$b97IexVtrakgBIcuEYOOyeKs504BbLAgJHeYfbUmdW4gMQOxOADQG'
            }
        ]
    };

    function makeRewardsArray() {
        return [
            {
                id: 1,
                text: 'New Habit',
                due_date: "2020-12-01",
                reward: 'New Test Reward',
                points: 100,
              }
        ]
    }

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.DATABASE_URL,
        });
        app.set('db', db)
    });

    after('disconnect from db', () => db.destroy());

    before('clean the table', () => {
        db.raw('TRUNCATE habitually_habits RESTART IDENTITY CASCADE;');
        db.raw('TRUNCATE habitually_users RESTART IDENTITY CASCADE;');
        db.raw('TRUNCATE habitually_rewards RESTART IDENTITY CASCADE;');
    });

    afterEach('cleanup', () => {
        db.raw('TRUNCATE habitually_habits RESTART IDENTITY CASCADE;');
        db.raw('TRUNCATE habitually_users RESTART IDENTITY CASCADE;');
        db.raw('TRUNCATE habitually_rewards RESTART IDENTITY CASCADE;');
    });

    context(`Given 'habitually_habits' has data`, () => {
        const testHabits = makeHabitsArray();
        const testUser = makeUserArray();
        const testRewards = makeRewardsArray();
        let jwt = '';

        beforeEach('insert user', () => {
            return db.into('habitually_users').insert(testUser);
        });

        beforeEach('insert habits', () => {
            return db.into('habitually_habits').insert(testHabits);
        });

        beforeEach('insert rewards', () => {
            return db.into('habitually_rewards').insert(testRewards);
        });

        beforeEach('signin and get jwt', async () => {
            const res = await supertest(app)
                .post('/auth/signin')
                .send({ username: 'testusertest', password: 'testusertestpw' })
                .set('Accept', 'application/json');
            jwt = res.body.authToken;
        });

        it(`gets all habits from habitually_habits`, () => {
            return supertest(app)
                .get('/habits')
                .set('Authorization', `Bearer ${jwt}`)
                .expect(res => {
                    expect(res.body.title).to.eql(testHabits[0].title);
                    expect(res.body).to.have.property('link');
                })
        })
    })
})