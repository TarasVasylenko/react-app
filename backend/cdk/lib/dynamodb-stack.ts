/**
 * DynamoDbStack
 * --------------
 * Створює таблицю Notes з ключами:
 * - partition key: id (string)
 * - sort key: createdAt (string)
 */

import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Table, AttributeType, BillingMode } from "aws-cdk-lib/aws-dynamodb";

export class DynamoDbStack extends Stack {
    public readonly todosTable: Table;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.todosTable = new Table(this, "TodosTable", {
            tableName: "Todos",
            partitionKey: {
                name: "id",
                type: AttributeType.STRING,
            },
            sortKey: {
                name: "createdAt",
                type: AttributeType.STRING,
            },
            billingMode: BillingMode.PAY_PER_REQUEST, // безкоштовно + масштабовано
            // політика видалення ресурсу, яка визначає, що має статися з DynamoDB таблицею
            // (або будь-яким іншим ресурсом), при видаленні CloudFormation stack.
            removalPolicy: RemovalPolicy.DESTROY,
        });
    }
}
