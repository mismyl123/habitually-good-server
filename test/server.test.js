const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');


describe('habits API:', function() {
  let db;
  let habits = [
    { 'habit': 'Drink Water?' },
    { 'habit': 'Stretch' },
    { 'habit': 'Reach Out to a Loved One'}
  ];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  before('cleanup', () => db.raw('TRUNCATE TABLE test-habits RESTART IDENTITY;'));

  afterEach('cleanup', () => db.raw('TRUNCATE TABLE test-habits RESTART IDENTITY;'));

  after('disconnect from the database', () => db.destroy());

  describe('GET all habits', () => {

    beforeEach('insert some habits', () => {
      return db('test-habits').insert(habits);
    });

    //relevant
    it('should respond to GET `/api/habits` with an array of habits and status 200', function() {
      return supertest(app)
        .get('/api/habits')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(habits.length);
          res.body.forEach((item) => {
            expect(item).to.be.a('object');
            expect(item).to.include.keys('id', 'title', 'completed');
          });
        });
    });

  });


  describe('GET habits by id', () => {

    beforeEach('insert some habits', () => {
      return db('habits').insert(habits);
    });

    it('should return correct habits when given an id', () => {
      let doc;
      return db('habits')
        .first()
        .then(_doc => {
          doc = _doc;
          return supertest(app)
            .get(`/api/habits/${doc.id}`)
            .expect(200);
        })
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys('habits');
          expect(res.body.id).to.equal(doc.id);
          expect(res.body.title).to.equal(doc.title);
          expect(res.body.completed).to.equal(doc.completed);
        });
    });

    it('should respond with a 404 when given an invalid id', () => {
      return supertest(app)
        .get('/api/habits/aaaaaaaaaaaa')
        .expect(404);
    });

  });


  describe('POST (create) new habit', function() {

    //relevant
    it('should create and return a new habit when provided valid data', function() {
      const newItem = {
          'habit': 'Drink Water'
      };

      return supertest(app)
        .post('/api/habits')
        .send(newItem)
        .expect(201)
        .expect(res => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'title', 'completed');
          expect(res.body.title).to.equal(newItem.title);
          expect(res.body.completed).to.be.false;
          expect(res.headers.location).to.equal(`/api/habits/${res.body.id}`);
        });
    });

    it('should respond with 400 status when given bad data', function() {
      const badItem = {
        foobar: 'broken item'
      };
      return supertest(app)
        .post('/api/habits')
        .send(badItem)
        .expect(400);
    });

  });


  describe('PATCH (update) habits by id', () => {

    beforeEach('insert some habits', () => {
      return db('habits').insert(habits);
    });

    //relevant
    it('should update item when given valid data and an id', function() {
      const item = {
        'title': 'Habitually Good'
      };

      let doc;
      return db('habits')
        .first()
        .then(_doc => {
          doc = _doc;
          return supertest(app)
            .patch(`/api/habits/${doc.id}`)
            .send(item)
            .expect(200);
        })
        .then(res => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'title', 'completed');
          expect(res.body.title).to.equal(item.title);
          expect(res.body.completed).to.be.false;
        });
    });

    it('should respond with 400 status when given bad data', function() {
      const badItem = {
        foobar: 'broken item'
      };

      return db('habits')
        .first()
        .then(doc => {
          return supertest(app)
            .patch(`/api/habits/${doc.id}`)
            .send(badItem)
            .expect(400);
        });
    });

    it('should respond with a 404 for an invalid id', () => {
      const item = {
        'title': 'Have No Fun'
      };
      return supertest(app)
        .patch('/api/habits/aaaaaaaaaaaaaaaaaaaaaaaa')
        .send(item)
        .expect(404);
    });

  });


  describe('DELETE a habit by id', () => {

    beforeEach('insert some habits', () => {
      return db('habits').insert(habits);
    });

    //relevant
    it('should delete an item by id', () => {
      return db('habits')
        .first()
        .then(doc => {
          return supertest(app)
            .delete(`/api/habits/${doc.id}`)
            .expect(204);
        });
    });

    it('should respond with a 404 for an invalid id', function() {
      return supertest(app)
        .delete('/api/habits/aaaaaaaaaaaaaaaaaaaaaaaa')
        .expect(404);
    });
  });
});