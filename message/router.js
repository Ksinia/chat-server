const express = require("express");
const Message = require("./model");

const { Router } = express; //destructuring

const router = new Router();

router.get("/message", (req, res, next) => {
  Message.findAll()
    .then(messages => res.send(messages))
    .catch(next); // catch(error=>next(error))
});

module.exports = router;
