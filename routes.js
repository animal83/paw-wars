"use strict";

const config = require('./config.json');

const app = require('./index.js').app;
const passport = require('./index.js').passport;
const Router = require('koa-router');

const routes = new Router();

const main = require('./controllers/main.js');

const items = require('./models/items.json');

// routes
let user = null;

routes.get('/', function* (){
  if (this.isAuthenticated()) {
    user = this.session.passport.user;
  }
  yield this.render('index', {title: config.site.name, user: user});
});

// for passport
routes.get('/login', function* (){
  if (this.isAuthenticated()) {
    user = this.session.passport.user;
  }
  yield this.render('login', {user: user});
});

routes.get('/logout', function* () {
  this.logout();
  this.redirect('/');
});

// you can add as many strategies as you want
routes.get('/auth/github',
  passport.authenticate('github')
);

routes.get('/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: '/account',
    failureRedirect: '/'
  })
);

routes.get('/account', main.account);

// game routes (these will be replaced by controllers)
routes.get('/game/market', function* (){
  yield this.render('game_market', {title: config.site.name, items: items});
});
routes.get('/game/airport', function* (){
  yield this.render('game_airport', {title: config.site.name});
});
routes.get('/game/bank', function* (){
  yield this.render('game_bank', {title: config.site.name});
});


app.use(routes.middleware());
