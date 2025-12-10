/**
 * Lambda: createNote
 * ------------------
 * Приймає JSON з { title, content }, створює нову нотатку,
 * генерує id і записує її в DynamoDB.
 */

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
// Генеруємо UUID версії 4 — випадковий унікальний ідентифікатор.
// Підходить для DynamoDB, бо не потребує лічильників і гарантує унікальність.
// @ts-ignore
// import { v4 as uuidv4 } from 'uuid';

// Ініціалізація клієнта DynamoDB
const ddb = new DynamoDBClient({});

export const handler = async (event: any) => {
    // event.body — JSON-строка, треба розпарсити
    const body = JSON.parse(event.body || "{}");

    // Формуємо структуру нотатки
    const item = {
        id: Date.now().toString(),
        content: body.content,
        createdAt: Date.now().toString(), // UNIX timestamp
    };

    // DynamoDB очікує "маршалізований" обʼєкт
    await ddb.send(
        new PutItemCommand({
            // @ts-ignore
            TableName: process.env.TODOS_TABLE,
            Item: marshall(item),
        })
    );

    return {
        statusCode: 201,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(item),
    };
};
