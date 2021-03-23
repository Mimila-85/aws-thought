const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const awsConfig = {
  region: "us-east-2",
  // endpoint: "http://localhost:8000", //remove to deploy
};
AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = "Thoughts";

// get all users' thoughts
router.get("/users", (req, res) => {
  const params = {
    TableName: table,
  };
  dynamodb.scan(params, (err, data) => {
    if (err) {
      res.status(500).json(err); // an error occurred
    } else {
      res.json(data.Items);
    }
  });
});

// get thoughts from a user
router.get("/users/:username", (req, res) => {
  console.log(`Querying for thought(s) from ${req.params.username}.`);
  const params = {
    TableName: table,
    // KeyConditionExpression property specifies the search criteria.
    // #un represents the attribute name username
    KeyConditionExpression: "#un = :user", // use operators such as <, =, <=, and BETWEEN to find a range of values
    ExpressionAttributeNames: {
      "#un": "username",
      "#ca": "createdAt",
      "#th": "thought",
      "#img": "image",
    },
    ExpressionAttributeValues: {
      ":user": req.params.username,
    },
    // Limit the retrieve attributes to be only the ones listed otherwise all attributes as retrieved from the table.
    ProjectionExpression: "#th, #ca, #img",
    ScanIndexForward: false, // false makes the order descending(true is default)
  };

  dynamodb.query(params, (err, data) => {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      res.status(500).json(err); // an error occurred
    } else {
      console.log("Query succeeded.");
      res.json(data.Items);
    }
  });
}); // closes the route for router.get(users/:username)

// Create new user
router.post("/users", (req, res) => {
  const params = {
    TableName: table,
    Item: {
      username: req.body.username,
      createdAt: Date.now(),
      thought: req.body.thought,
      image: req.body.image,
    },
  };
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error(
        "Unable to add item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      res.status(500).json(err); // an error occurred
    } else {
      console.log("Added item:", JSON.stringify(data));
      res.json({ Added: JSON.stringify(data, null, 2) });
    }
  });
}); // ends the route for router.post('/users')

// Destroy
router.delete("/users/:time/:username", (req, res) => {
  const username = "Ray Davis";
  const time = 1602466687289;
  const thought =
    "Tolerance only for those who agree with you is no tolerance at all.";

  const params = {
    TableName: table,
    Key: {
      username: username,
      createdAt: time,
    },
    KeyConditionExpression: "#ca = :time",
    ExpressionAttributeNames: {
      "#ca": "createdAt",
    },
    ExpressionAttributeValues: {
      ":time": time,
    },
  };

  console.log("Attempting a conditional delete...");
  dynamodb.delete(params, (err, data) => {
    if (err) {
      console.error(
        "Unable to delete item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      res.status(500).json(err); // an error occurred
    } else {
      console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
    }
  });
});

module.exports = router;
