const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Habits Endpoints', function() {
  let db

  const testUser = helpers.makeUser()
  const testHabits = helpers.makeHabitsArray(testUser)

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/habits`, () => {
    context(`Given no habits`, () => {
      beforeEach(() => helpers.seedUser(db, testUser))

      it(`responds with 200 and empty response`, () => {
        return supertest(app)
          .get('/api/habits')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, [])
      })
    })

    context(`Given there are habits`, () => {
      beforeEach('insert habits', () =>
        helpers.seedHabits(db, testUser, testHabits)
      )

      it(`responds with 200 and all of the user's habits`, () => {
        const expectedHabits = testHabits.map(habits =>
          helpers.makeExpectedHabits(habits)
        )

        return supertest(app)
          .get('/api/habits')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedHabits)
      })
    })

    context(`Given an XSS attack habit`, () => {
      const { maliciousHabits, expectedHabits } = helpers.makeMaliciousHabits(
        testUser
      )

      beforeEach('insert malicious habit', () => {
        return helpers.seedMaliciousHabits(db, testUser, maliciousHabits)
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/habits`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body[0].text).to.eql(expectedHabits.text)
            expect(res.body[0].reward).to.eql(expectedHabits.reward)
          })
      })
    })
  })

  describe(`POST /api/habits`, () => {
    beforeEach('insert habits', () => helpers.seedHabits(db, testUser, testHabits))

    it(`creates a habit, responds with 201 and the new task`, function() {
      const newHabits = {
        text: 'New Habit to do...',
        due_date: '2020-01-01',
        reward: 'new test reward',
        points: 100,
        user_id: testUser.id
      }

      return supertest(app)
        .post('/api/habits')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newHabits)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.text).to.eql(newHabits.text)
          expect(res.body.reward).to.eql(newHabits.reward)
          expect(Number(res.body.points)).to.eql(newHabits.points)
          const expectedDate = new Date(newHabits.due_date).toLocaleString()
          const actualDate = new Date(res.body.due_date).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
        })
        .expect(res =>
          db
            .from('habitually_habits')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.text).to.eql(newHabits.text)
              expect(row.text).to.eql(newHabits.text)
              expect(row.reward).to.eql(newHabits.reward)
              expect(Number(row.points)).to.eql(newHabits.points)
              const expectedDate = new Date(newHabits.due_date).toLocaleString()
              const actualDate = new Date(row.due_date).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
            })
        )
    })

    const requiredFields = [ 'text', 'due_date', 'reward', 'points' ]

    requiredFields.map(field => {
      const newHabits = {
        text: 'New Habit to do...',
        due_date: '2020-01-01',
        reward: 'new test reward',
        points: 100,
        user_id: testUser.id
      }

      it(`responds with 400 and 'Missing '${field}' in request body'`, () => {
        delete newHabits[field]

        return supertest(app)
          .post('/api/habits')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(newHabits)
          .expect(400, { error: `Missing '${field}' in request body` })
      })
    })
  })
})