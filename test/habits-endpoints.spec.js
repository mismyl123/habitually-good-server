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
      connection: process.env.TEST_DB_URL
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

      it(`responds with 200 and all of the user's tasks`, () => {
        const expectedHabits = testHabits.map(habits =>
          helpers.makeExpectedTask(habits)
        )

        return supertest(app)
          .get('/api/habits')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedTasks)
      })
    })

    context(`Given an XSS attack task`, () => {
      const { maliciousHabit, expectedHabit } = helpers.makeMaliciousHabit(
        testUser
      )

      beforeEach('insert malicious habit', () => {
        return helpers.seedMaliciousHabit(db, testUser, maliciousHabit)
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

    it(`creates a habit, responds with 201 and the new habit`, function() {
      const newHabit = {
        text: 'New Habit to do...',
        due_date: '2020-01-01',
        reward: 'new test reward',
        xp: 100,
        user_id: testUser.id
      }

      return supertest(app)
        .post('/api/habits')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newHabit)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.text).to.eql(newTask.text)
          expect(res.body.reward).to.eql(newTask.reward)
          expect(Number(res.body.xp)).to.eql(newTask.xp)
          const expectedDate = new Date(newTask.due_date).toLocaleString()
          const actualDate = new Date(res.body.due_date).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
        })
        .expect(res =>
          db
            .from('backburner_tasks')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.text).to.eql(newTask.text)
              expect(row.text).to.eql(newTask.text)
              expect(row.reward).to.eql(newTask.reward)
              expect(Number(row.xp)).to.eql(newTask.xp)
              const expectedDate = new Date(newTask.due_date).toLocaleString()
              const actualDate = new Date(row.due_date).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
            })
        )
    })

    const requiredFields = [ 'text', 'due_date', 'reward', 'xp' ]

    requiredFields.map(field => {
      const newTask = {
        text: 'New Task to do...',
        due_date: '2020-01-01',
        reward: 'new test reward',
        xp: 100,
        user_id: testUser.id
      }

      it(`responds with 400 and 'Missing '${field}' in request body'`, () => {
        delete newTask[field]

        return supertest(app)
          .post('/api/tasks')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(newTask)
          .expect(400, { error: `Missing '${field}' in request body` })
      })
    })
  })
})