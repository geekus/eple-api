'use strict';

const assert = require('assert');
const request = require('supertest');

const r = require('../../lib/rethinkdb');
const app = require('../../index');
const fixtures = require('../fixtures/slack');

describe('slack', () => {
  it('saves reaction to database', (done) => {
    const data = fixtures.events.reaction;

    request(app)
      .post('/slack/event')
      .send(Object.assign(
        fixtures.events.meta,
        {event: fixtures.events.reaction}
      ))
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        return r
          .slackEvents
          .get(res.body.data.id)
          .run(r.c);
      })
      .then((res) => {
        assert.equal(res.reaction, data.reaction)
        done();
      })
      .catch((err) => {
        console.error(err);
      });
  });
});

