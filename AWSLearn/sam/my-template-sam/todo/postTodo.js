const axios = require("axios");
const url = "http://checkip.amazonaws.com/";
const { DynamoDB } = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');
let response = {};
const docClient = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

exports.postTodo = async (event, context) => {
  const ret = await axios(url);
  try {
    const {
      headers,
      httpMethod,
      path,
      pathParameters,
      queryStringParameters,
      body,
    } = event;

    if (httpMethod !== "POST") {
      throw new Error(
        `this method only accepts POST method, you tried: ${httpMethod} method.`
      );
    }

    const bodyData = JSON.parse(body);
    const id = uuidv4();
    const newBody = { ...bodyData , id:  id}
    
    const params = {
      TableName: tableName,
      Item: newBody,
    };
    const isInsert = await docClient.put(params).promise();
    console.log(isInsert);

    response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify({
        message: "postTodo",
        data: newBody,
        // event: event,
        location: ret.data.trim(),
        // env: process.env,
      }),
    };
  } catch (err) {
    console.log(err);
    response = {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify({
        message: err.message,
        event: event,
        location: ret.data.trim(),
        env: process.env,
      }),
    };
  }

  return response;
};
