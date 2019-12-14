const { Router } = require("express");
const { toJWT, toData } = require("./jwt");
const User = require("../user/model");
const bcrypt = require("bcrypt");

function login(res, name = null, password = null) {
  if (!name || !password) {
    res.status(400).send({
      message: "Please supply a valid name and password"
    });
  } else {
    User.findOne({ where: { name: name } })
      .then(user => {
        if (!user) {
          res.status(400).send({
            message: "User with that name does not exist"
          });
        }
        // 2. use bcrypt.compareSync to check the password against the stored hash
        else if (bcrypt.compareSync(password, user.password)) {
          // 3. if the password is correct, return a JWT with the userId of the user (user.id)
          res.send({
            jwt: toJWT({ userId: user.id })
          });
        } else {
          res.status(400).send({
            message: "Password was incorrect"
          });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({
          message: "Something went wrong: " + err
        });
      });
  }
}

function factory(stream) {
  const router = new Router();

  router.post("/login", (req, res, next) => {
    const name = req.body.name;
    const password = req.body.password;
    login(res, name, password);
  });

  return router;
}
module.exports = { factory, login };
