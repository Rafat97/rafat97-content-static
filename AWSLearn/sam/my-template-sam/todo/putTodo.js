const axios = require("axios");
const url = "http://checkip.amazonaws.com/";
const { DynamoDB } = require("aws-sdk");
let response = {};
const docClient = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

exports.putTodo = async (event, context) => {
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

    if (httpMethod !== "PUT") {
      throw new Error(
        `this method only accepts PUT method, you tried: ${httpMethod} method.`
      );
    }

    const bodyData = JSON.parse(body);
    const { id } = pathParameters;
    const newBody = { ...bodyData , id:  id}
    
    const params = {
      TableName: tableName,
      Item: newBody,
    };
    const isPuted = await docClient.put(params).promise();

    console.log(isPuted);

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
        data: bodyData,
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
