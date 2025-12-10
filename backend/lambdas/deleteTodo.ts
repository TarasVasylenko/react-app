/**
 * Lambda: deleteTodo
 * -------------------
 * Приймає JSON з { id }, видаляє нотатку з DynamoDB.
 */

import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddb = new DynamoDBClient({});

export const handler = async (event: any) => {
    const body = JSON.parse(event.body || "{}");

    if (!body.id || !body.createdAt) {
        return {
            statusCode: 422,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ message: "Missing id or createdAt" }),
        };
    }

    console.log(body);

    await ddb.send(
        new DeleteItemCommand({
            // @ts-ignore
            TableName: process.env.TODOS_TABLE,
            Key: marshall({ id: body.id, createdAt: body.createdAt }),
        })
    );

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Todo deleted successfully" }),
    };
};
