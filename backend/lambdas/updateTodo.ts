/**
 * Lambda: updateTodo
 * -------------------
 * Приймає JSON з { id, content }, оновлює існуючу нотатку в DynamoDB.
 */

import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddb = new DynamoDBClient({});

export const handler = async (event: any) => {
    const body = JSON.parse(event.body || "{}");

    if (!body.id || !body.content || !body.createdAt) {
        return {
            statusCode: 422,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ message: "Missing id / createdAt / content" }),
        };
    }

    const item = {
        id: body.id,
        content: body.content,
        createdAt: Date.now().toString(), // UNIX timestamp
    };

    await ddb.send(
        new UpdateItemCommand({
            // @ts-ignore
            TableName: process.env.TODOS_TABLE,
            Key: marshall({ id: body.id, createdAt: body.createdAt }),
            UpdateExpression: "SET content = :content, updatedAt = :updatedAt",
            ExpressionAttributeValues: marshall({
                ":content": item.content,
                ":updatedAt": item.createdAt,
            }),
        })
    );

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(item),
    };
};
