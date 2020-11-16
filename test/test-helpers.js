
process.env.TZ = 'UTC'
process.env.NODE_ENV = 'test'

require('dotenv').config()
const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest



/*function seedMaliciousArticle(db, user, article) {
    return db
      .into('blogful_users')
      .insert([user])
      .then(() =>
        db
          .into('blogful_articles')
          .insert([article])
      )
  }

+ function makeAuthHeader(user) {
+   const token = Buffer.from(`${user.user_name}:${user.password}`).toString('base64')
+   return `Basic ${token}`
+ }

  module.exports = {
    makeUsersArray,
    makeArticlesArray,
    makeExpectedArticle,
    makeExpectedArticleComments,
    makeMaliciousArticle,
    makeCommentsArray,

    makeArticlesFixtures,
    cleanTables,
    seedArticlesTables,
    seedMaliciousArticle,
+   makeAuthHeader,
  }