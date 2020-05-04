# Triton Exchange Backend

[![Build Status](https://travis-ci.com/paulpan05/te-app-backend.svg?token=AwrSN7YWy67cvrqMpyHB&branch=master)](https://travis-ci.com/paulpan05/te-app-backend)

## Project technologies
 - Firebase Auth
 - AWS DynamoDB
 - AWS Lambda / API Gateway
 - Serverless (for deployment on master branch)

## How to set up
To set up project
```sh
npm i -g serverless
npm i
npm run install-db
```

To test app locally

```sh
npm start
```

Install ESLint and Prettier plugins on your Visual Studio Code to enable automatic syntax warning and correction.

## Deployment

App is deployed every time new changes are pushed to master brach, via Serverless CI