'use strict';

const r = require('../lib/rethinkdb');

before(done => r.on('open', done));

const tables = ['slack_events'];

tables.forEach((table) => {
  beforeEach((done) => {
    r.r.tableCreate(table).run(r.c, done);
  });

  afterEach((done) => {
    r.r.tableDrop(table).run(r.c, done);
  });
});
