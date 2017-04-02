'use strict';

const fs = require('fs');

const variables = [
  {name: 'SLACK_CLIENT_ID', env: ['development', 'production']},
  {name: 'SLACK_CLIENT_SECRET', env: ['development', 'production']},
  {name: 'SLACK_VERIFICATION_TOKEN', env: ['development', 'production']}
];

function getFromJson() {
  try {
    return JSON.parse(fs.readFileSync('/secrets/eple-api/prod.json', {encoding: 'utf-8'}));
  } catch (err) {
    throw new Error('Could not read secrets file "prod.json"');
  }
}

function getFromProcess() {
  return variables
    .filter((variable) => {
      if (variable.env) {
        return variable.env.find(env => /^development|test$/.test(env));
      }
      return true;
    })
    .reduce((object, variable) => {
      const value = process.env[variable.name];
      object[variable.name] = value;

      return object;
    }, {});
}

let secrets;

switch (process.env.NODE_ENV) {
  case 'test':
    secrets = getFromProcess();
    break;
  case 'development':
  case 'production':
    secrets = getFromJson();
    break;
  default:
    throw new Error('Environment variable "NODE_ENV" is undefined or invalid');
}

variables
  .filter((variable) => {
    if (variable.env) {
      return variable.env.find(env => new RegExp(process.env.NODE_ENV).test(env));
    }
    return true;
  })
  .forEach((variable) => {
    if (typeof secrets[variable.name] === 'undefined') {
      throw new Error(`Environvent variable ${variable.name} is missing`);
    }
  });

module.exports = secrets;
