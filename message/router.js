const express = require("express");
const Message = require("./model");

const { Router } = express; //destructuring

const router = new Router();

// этот эндпойнт мы не будем использовать, он только для теста
router.get("/message", (req, res, next) => {
  Message.findAll()
    .then(messages => res.send(messages))
    .catch(next); // catch(error=>next(error))
});

router.post("/message", (req, res, next) => {
  Message.create(req.body)
    .then(message => res.send(message))
    .catch(next);
});

module.exports = router;
