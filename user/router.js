const { Router } = require("express");
const User = require("./model");
const bcrypt = require("bcrypt");
const { login } = require("../auth/router");

// функция, создающая роутер
function factory(stream) {
  router = new Router();
  router.post("/user", (req, res, next) => {
    const user = {
      name: req.body.name,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    User.findOne({ where: { name: req.body.name } }).then(data => {
      if (data) {
        res.status(400).send({
          message: "This name is already in use"
        });
      } else {
        User.create(user)
          .then(user => login(stream, res, user.name, user.password))
          .catch(error => next(error));
      }
    });
  });
  return router;
}

module.exports = factory;
