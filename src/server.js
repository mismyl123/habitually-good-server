require("dotenv").config();

const app = require("./app.js");
const { PORT, DATABASE_URL } = require('./config');
const knex = require("knex");

const db = knex({
  client: "pg",
 connection: NODE_ENV === "test" ? TEST_DATABASE_URL : DATABASE_URL,
});

app.set("db", db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});