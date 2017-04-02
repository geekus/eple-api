'use strict';

const express = require('express');
const router = new express.Router();

const r = require('./lib/rethinkdb');
const secrets = require('./lib/secrets');

router.use((req, res, next) => {
  if (req.body.challenge) {
    if (req.body.token !== secrets.SLACK_VERIFICATION_TOKEN) {
      throw new Error('Unauthorized Slack app tried to use endpoint');
    }

    res.json({challenge: req.body.challenge});
  }

  next();
});

router.post('/event', (req, res, next) => {
  r
    .slackEvents
    .insert({
      reaction: req.body.event.reaction,
    })
    .run(r.c)
    .then((result) => {
      res.json({
        message: 'Ok',
        data: {
          id: result.generated_keys[0],
          reaction: req.body.reaction,
        },
      });
    })
    .catch((err) => {
      throw new Error(err);
    });
});

module.exports = router;
