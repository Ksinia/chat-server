const express = require("express");
const Message = require("./model");

const { Router } = express; //destructuring

const router = new Router();

// router.get("/message", (req, res, next) => {
//     Message.findAll()
//     .then(messages => res.send(messages))
//     .catch(next); // catch(error=>next(error))
// });

// этот эндпойнт мы не будем использовать, он только для теста
router.get("/message", async (req, res, next) => {
  const messages = await Message.findAll();
  res.send(messages);
});

// сейчас модно использовать async await
router.post("/message", async (req, res, next) => {
  const message = await Message.create(req.body);
  res.send(message);
});

module.exports = router;
