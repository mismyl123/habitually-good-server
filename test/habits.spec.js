
const knex = require('knex');
const app = require('../src/app');
const config = require('../src/config');
const supertest = require('supertest');
const HabitsService = require('../src/habits/habits-service');

describe(`GET /habits/:habits_id`, () => {

    function makeHabitsArray() {
        return [
            {
                id: 1,
                text: 'New Habit',
                due_date: "2020-12-01",
                
              }
        ]
    };

    function makeUserArray() {
        return [
            {
                id: 2,
                username: 'testusertest',
                password: '$2a$12$4NY47Y1BNH8KuWlMNRzFUOhOn578wlcdgRm1bq9eEcdnVi/Mg1yd.'
            }
        ]
    };

   
    describe(`GET /habits/:habits_id`, () => {
        let db;

        before('make knex instance', () => {
            db = knex({
                client: 'pg',
                connection: process.env.DATABASE_URL
            });
            app.set('db', db)
        });

        after('disconnect from db', () => db.destroy());

        before('clean the table', () => {
            db.raw('TRUNCATE habitually_habits RESTART IDENTITY CASCADE;');
            db.raw('TRUNCATE habitually_users RESTART IDENTITY CASCADE;');
        });

        afterEach('cleanup', () => {
            db.raw('TRUNCATE habitually_habits RESTART IDENTITY CASCADE;');
            db.raw('TRUNCATE habitually_users RESTART IDENTITY CASCADE;');
        });

        context('Given there are habits in the database', () => {
            const testHabits = makeHabitsArray();
            const testUser = makeUserArray();
            let jwt = '';

            beforeEach('insert user', () => {
                return db.into('habitually_users').insert(testUser);
            });

            beforeEach('insert habits', () => {
                return db.into('habitually_habits').insert(testHabits);
            });

            beforeEach('signin and get jwt', () => {
                return supertest(app)
                    .post('/auth/signin')
                    .send({ username: 'testusertest', password: 'testusertestpw' })
                    .set('Accept', 'application/json')
                    .then(res => {
                        jwt = res.body.authToken
                    })
            });

            it('responds with 200 and a single habit', () => {
                return supertest(app)
                    .get('/habits')
                    .set('Authorization', `Bearer ${jwt}`)
                    .expect(res => {
                        expect(res.body.name).to.eql(testHabits[0].name);
                        expect(res.body).to.have.property('id');
                    })
            })
        })
    })
})