const express = require("express");
const app = express();
const MessageRouterFactory = require("./message/router");
const bodyParser = require("body-parser");
const Sse = require("json-sse");
const Message = require("./message/model");

const port = 4000;

const stream = new Sse();
const MessageRouter = MessageRouterFactory(stream);

app.get("/", (req, res) => {
  stream.send("hi");
  res.send("Hello");
});

//endpoint for connecting to a stream
app.get("/stream", async (req, res, next) => {
  try {
    // get data from DB
    const messages = await Message.findAll();
    //serialize (convert array of massages into a string)
    const string = JSON.stringify(messages);
    // prepare string for sending to clients as soon as they connect (like loading a gun)
    stream.updateInit(string);
    // connect this user to the stream. You don't need to make res.send by yourself. Stream breaks the rule
    // that you cannot send multiple responses to 1 request.
    stream.init(req, res);
  } catch (error) {
    next(error);
  }
});

const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(MessageRouter);

app.listen(port, () => console.log(`Listening on port : ${port}`));
