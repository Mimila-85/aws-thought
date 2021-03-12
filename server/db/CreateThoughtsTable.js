// import the aws-sdk package
const AWS = require("aws-sdk");

// modify the AWS config object that DynamoDB will use to connect
// config points to local instance,
// updates local environmental variables
AWS.config.update({
  region: "us-east-2",
  endpoint: "http://localhost:8000",
});

// create the DynamoDB service object
// specifying the API version in the preceding statement, we ensure that the API library we're using is compatible with the following commands.
// this is also the latest long-term support version, or LTS.
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const params = {
  TableName: "Thoughts",
  // keySchema property, defines the partition key and the sort key
  KeySchema: [
    { AttributeName: "username", KeyType: "HASH" }, //Partition key
    { AttributeName: "createdAt", KeyType: "RANGE" }, //Sort key
  ],
  // AttributeDefinitions property, defines the attributes for the hash and range keys
  AttributeDefinitions: [
    { AttributeName: "username", AttributeType: "S" }, // S for string
    { AttributeName: "createdAt", AttributeType: "N" }, // N for number
  ],
  // ProvisionedThroughput property, sts maximum write and read capacity of the database
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};
// create table method using schema params
dynamodb.createTable(params, (err, data) => {
  if (err) {
    console.error(
      "Unable to create table. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log(
      "Created table. Table description JSON:",
      JSON.stringify(data, null, 2)
    );
  }
});
