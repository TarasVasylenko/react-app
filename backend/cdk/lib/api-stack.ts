
/**
 * ApiStack
 * ---------
 * Створює простий REST API:
 *
 * GET  /notes  → getNotesFn
 * POST /notes  → createNoteFn
 *
 * Додає CORS, щоб React міг викликати API.
 */

import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib";

export interface ApiStackProps extends StackProps {
    getTodosFn: IFunction;
    createTodoFn: IFunction;
    updateTodoFn: IFunction;
    deleteTodoFn: IFunction;
}

export class ApiStack extends Stack {
    public readonly api: apigw.RestApi;

    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        this.api = new apigw.RestApi(this, "TodosApi", {
            restApiName: "Todos Service",
            defaultCorsPreflightOptions: {
                allowOrigins: apigw.Cors.ALL_ORIGINS,
                allowMethods: apigw.Cors.ALL_METHODS,
            },
        });

        const todos = this.api.root.addResource("todos");

        todos.addMethod("GET", new apigw.LambdaIntegration(props.getTodosFn));
        todos.addMethod("POST", new apigw.LambdaIntegration(props.createTodoFn));
        todos.addMethod("PUT", new apigw.LambdaIntegration(props.updateTodoFn));
        todos.addMethod("DELETE", new apigw.LambdaIntegration(props.deleteTodoFn));

        // Виводимо URL у термінал після деплою
        new cdk.CfnOutput(this, "ApiUrl", {
            value: this.api.url,
        });
    }
}
