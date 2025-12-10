/**
 * cdk.ts
 * -------
 * Збирає всі стеки:
 * 1) DynamoDbStack
 * 2) LambdaStack
 * 3) ApiStack
 *
 * Порядок важливий: Lambda залежить від DynamoDB, API залежить від Lambda.
 */

import * as cdk from "aws-cdk-lib";
import { DynamoDbStack } from "../lib/dynamodb-stack";
import { LambdaStack } from "../lib/lambda-stack";
import { ApiStack } from "../lib/api-stack";

const app = new cdk.App();

// 1) Таблиця DynamoDB
const db = new DynamoDbStack(app, "DbStack");

// 2) Lambda-функції, які працюють з таблицею
const lambdas = new LambdaStack(app, "LambdaStack", {
    todosTable: db.todosTable,
});

// 3) REST API, який викликає Lambda
new ApiStack(app, "ApiStack", {
    getTodosFn: lambdas.getTodosFn,
    createTodoFn: lambdas.createTodoFn,
    updateTodoFn: lambdas.updateTodoFn,
    deleteTodoFn: lambdas.deleteTodoFn,
});
