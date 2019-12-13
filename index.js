const express = require("express");
const app = express();
const port = 4000;
const MessageRouter = require("./message/router");
const bodyParser = require("body-parser");

app.get("/", (req, res) => {
  res.send("Hello");
});

const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(MessageRouter);

app.listen(port, () => console.log(`Listening on port : ${port}`));
