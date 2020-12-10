module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/habitually',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/habitually-test',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h'
};