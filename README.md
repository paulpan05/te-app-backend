# Triton Exchange Backend

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

## Deployment

App is deployed every time new changes are pushed to master brach, via Serverless CI