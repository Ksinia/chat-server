const express = require("express");
const app = express();
const MessageRouterFactory = require("./message/router");
const bodyParser = require("body-parser");
const Sse = require("json-sse");
const Message = require("./message/model");
const cors = require("cors");

const port = 4000;

const corsMiddleware = cors();
app.use(corsMiddleware);

const stream = new Sse();
const MessageRouter = MessageRouterFactory(stream);

const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(MessageRouter);

//endpoint for connecting to a stream
app.get("/stream", async (req, res, next) => {
  try {
    // get data from DB
    const messages = await Message.findAll();

    // make action object
    const action = {
      type: "ALL_MESSAGES",
      payload: messages
    };

    // we need to stringify because json-sse uses string as a messages and uses array as an array of messages
    //serialize (convert array of massages into a string)
    const string = JSON.stringify(action);
    // prepare string for sending to clients as soon as they connect (like loading a gun)
    stream.updateInit(string);
    // connect this user to the stream. You don't need to make res.send by yourself. Stream breaks the rule
    // that you cannot send multiple responses to 1 request.
    stream.init(req, res);
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => console.log(`Listening on port : ${port}`));
