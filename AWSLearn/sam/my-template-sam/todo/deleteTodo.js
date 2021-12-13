const axios = require("axios");
const url = "http://checkip.amazonaws.com/";
const { DynamoDB } = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
let response = {};
const docClient = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

exports.deleteTodo = async (event, context) => {
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

    if (httpMethod !== "DELETE") {
      throw new Error(
        `this method only accepts DELETE method, you tried: ${httpMethod} method.`
      );
    }

    const { id } = pathParameters;
    const params = {
      TableName: tableName,
      Key: {
        id: id,
      },
    };

    const isDelete = await docClient.delete(params).promise();
    console.log(isDelete);

    response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify({
        // message: "postTodo",
        data: "deleted successfully",
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
