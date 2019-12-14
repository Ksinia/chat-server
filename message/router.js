const express = require("express");
const Message = require("./model");
const { Router } = express; //destructuring
const authMiddleware = require("../auth/middleware");
const User = require("../user/model");

// функция, создающая роутер
function factory(stream) {
  const router = new Router();

  // router.get("/message", (req, res, next) => {
  //     Message.findAll()
  //     .then(messages => res.send(messages))
  //     .catch(next); // catch(error=>next(error))
  // });

  // этот эндпойнт мы не будем использовать, он только для теста
  // router.get("/message", async (req, res, next) => {
  //   try {
  //     const messages = await Message.findAll();
  //     res.send(messages);
  //   } catch (error) {
  //     next(error);
  //   }
  // });

  // сейчас модно использовать async await
  // router.post("/message", async (req, res, next) => {
  //   try {
  //     const message = await Message.create(req.body);
  //     res.send(message);
  //   } catch (error) {
  //     next(error);
  //   }
  // });

  //второй вариант написание того же без анонимных функций
  async function onPost(req, res, next) {
    try {
      const message = await Message.create({
        text: req.body.text,
        userId: req.body.userId
      });
      const user = await User.findByPk(req.body.userId, {
        attributes: ["name"]
      });
      message.dataValues.user = user.dataValues; // we can't write to messages directly,
      // values are actually stored under dataValues key

      // we move action to the server! Because otherwise the client will not know
      // what is coming from server in a stream
      const action = {
        type: "NEW_MESSAGE",
        payload: message
      };
      const string = JSON.stringify(action);
      stream.send(string);
      res.send(message);
    } catch (error) {
      next(error);
    }
  }
  router.post("/message", authMiddleware, onPost);

  return router;
}

module.exports = factory;
