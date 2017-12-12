const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./services/auth');
const MongoStore = require('connect-mongo')(session);

const app = express();

mongoose.Promise = global.Promise;

const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL);

app.use(bodyParser.json());
routes(app);

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'aaabbbccc',
  store: new MongoStore({
    url: DB_URL,
    autoReconnect: true
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

module.exports = app;
