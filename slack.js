'use strict';

const express = require('express');
const router = new express.Router();

router.use((req, res, next) => {
  if (req.body.challenge) {
    res.json({challenge: req.body.challenge});
  }

  next();
});

module.exports = router;
