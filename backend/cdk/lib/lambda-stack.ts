
/**
 * LambdaStack
 * ------------
 * Створює 2 Lambda-функції:
 * - getNotes
 * - createNote
 *
 * Передає їм NOTES_TABLE у середовище
 * і дає права читання/запису в DynamoDB.
 */

import { Stack, StackProps, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export interface LambdaStackProps extends StackProps {
    todosTable: Table;
}

export class LambdaStack extends Stack {
    public readonly getTodosFn: NodejsFunction;
    public readonly createTodoFn: NodejsFunction;
    public readonly updateTodoFn: NodejsFunction;
    public readonly deleteTodoFn: NodejsFunction;

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        this.getTodosFn = new NodejsFunction(this, "GetTodoFn", {
            entry: path.join(__dirname, "../../lambdas/getTodos.ts"),
            handler: "handler",
            runtime: Runtime.NODEJS_20_X,
            timeout: Duration.seconds(10),
            environment: {
                TODOS_TABLE: props.todosTable.tableName,
            },
        });

        this.createTodoFn = new NodejsFunction(this, "CreateTodoFn", {
            entry: path.join(__dirname, "../../lambdas/createTodo.ts"),
            handler: "handler",
            runtime: Runtime.NODEJS_20_X,
            timeout: Duration.seconds(10),
            environment: {
                TODOS_TABLE: props.todosTable.tableName,
            },
        });

        this.updateTodoFn = new NodejsFunction(this, "UpdateTodoFn", {
            entry: path.join(__dirname, "../../lambdas/updateTodo.ts"),
            handler: "handler",
            runtime: Runtime.NODEJS_20_X,
            timeout: Duration.seconds(10),
            environment: {
                TODOS_TABLE: props.todosTable.tableName,
            },
        });

        this.deleteTodoFn = new NodejsFunction(this, "DeleteTodoFn", {
            entry: path.join(__dirname, "../../lambdas/deleteTodo.ts"),
            handler: "handler",
            runtime: Runtime.NODEJS_20_X,
            timeout: Duration.seconds(10),
            environment: {
                TODOS_TABLE: props.todosTable.tableName,
            },
        });

        // Права доступу
        props.todosTable.grantReadData(this.getTodosFn);
        props.todosTable.grantReadWriteData(this.createTodoFn);
        props.todosTable.grantReadWriteData(this.updateTodoFn);
        props.todosTable.grantReadWriteData(this.deleteTodoFn);
    }
}
