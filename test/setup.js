
process.env.TZ = 'UTC'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret'
process.env.JWT_EXPIRY = '3m'

require('dotenv').config()

process.env.DATABASE_URL = process.env.DATABASE_URL
    || "postgresql://michellelalonde@localhost/habitually"

const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;