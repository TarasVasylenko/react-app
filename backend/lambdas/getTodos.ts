
/**
 * Lambda: getNotes
 * -----------------
 * Повертає всі нотатки з DynamoDB.
 * Використовує Scan (не оптимально для production).
 */

import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

// Ініціалізація клієнта DynamoDB.
// Порожній {} означає: використовувати регіон та креденшели з AWS Lambda середовища.
const ddb = new DynamoDBClient({});

export const handler = async () => {
    // Scan читає всю таблицю — ок для невеликих таблиць з однорідною структурою, погано для масштабування.
    const res = await ddb.send(
        new ScanCommand({
            // @ts-ignore
            TableName: process.env.TODOS_TABLE // імʼя таблиці передає CDK
        })
    );

    // DynamoDB повертає "raw" формати — unmarshall перетворює їх у звичайні JS обʼєкти.
    const items = (res.Items || []).map((i) => unmarshall(i));

    // Сортуємо по createdAt — нові зверху.
    items.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Дозволяє браузеру робити запити з будь-якого домену (CORS).
            /*
             Дозволяємо запити лише з вашого фронтенду
             "Access-Control-Allow-Origin": "https://my-frontend.app",

             Дозволяємо типові методи (GET/POST/PUT/DELETE)
             "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",

             Дозволяємо потрібні заголовки
             "Access-Control-Allow-Headers": "Content-Type",

             Дозволяємо надсилати куки/авторизацію (якщо треба)
             "Access-Control-Allow-Credentials": "true"
            */
        },
        body: JSON.stringify(items),
    };
};
