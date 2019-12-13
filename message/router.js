const express = require("express");
const Message = require("./model");

const { Router } = express; //destructuring

// функция, создающая роутер
function factory(stream) {
  const router = new Router();

  // router.get("/message", (req, res, next) => {
  //     Message.findAll()
  //     .then(messages => res.send(messages))
  //     .catch(next); // catch(error=>next(error))
  // });

  // этот эндпойнт мы не будем использовать, он только для теста
  router.get("/message", async (req, res, next) => {
    try {
      const messages = await Message.findAll();
      res.send(messages);
    } catch (error) {
      next(error);
    }
  });

  // сейчас модно использовать async await
  // router.post("/message", async (req, res, next) => {
  //   try {
  //     const message = await Message.create(req.body);
  //     res.send(message);
  //   } catch (error) {
  //     next(error);
  //   }
  // });

  //второй варинат написание того же без анонимных функций
  async function onPost(req, res, next) {
    try {
      const message = await Message.create(req.body);

      const string = JSON.stringify(message);
      stream.send(string);

      res.send(message);
    } catch (error) {
      next(error);
    }
  }
  router.post("/message", onPost);

  return router;
}

module.exports = factory;
