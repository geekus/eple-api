'use strict';

const express = require('express');
const router = new express.Router();

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

module.exports = router;
