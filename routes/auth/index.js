const express = require("express");
const router = express.Router();
const serverResponses = require("../../utils/helpers/responses");
const messages = require("../../config/messages");
const { User } = require("../../models/user");
const bcrypt = require("bcrypt");

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        const { password, ...userDetails } = user.toJSON();
        bcrypt
          .compare(req.body.password, password)
          .then((passwordCheck) => {
            // check if password matches
            if (!passwordCheck) {
              serverResponses.sendError(res, messages.AUTHENTICATION_FAILED);
            }

            req.session.user = user;
            //   return success response
            serverResponses.sendSuccess(res, messages.SUCCESSFUL_LOGIN, {
              name: user.name,
            });
          })
          // catch error if password does not match
          .catch((error) => {
            serverResponses.sendError(res, messages.AUTHENTICATION_FAILED);
          });
      } else {
        serverResponses.sendError(res, messages.AUTHENTICATION_FAILED);
      }
    })
    .catch((e) => {
      serverResponses.sendError(res, messages.BAD_REQUEST, e);
    });
});

router.post("/register", async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
  };
  let user = await User.findOne({ email: data.email });
  if (user) {
    return serverResponses.sendError(res, messages.ALREADY_EXIST);
  }
  if (req.body.phone) {
    data.phone = req.body.phone;
  }

  bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
      data.password = hashedPassword;
      user = new User(data);
      user
        .save()
        .then((result) => {
          serverResponses.sendSuccess(res, messages.SUCCESSFUL, result);
        })
        .catch((e) => {
          serverResponses.sendError(res, messages.BAD_REQUEST, e);
        });
    })
    .catch((e) => {
      serverResponses.sendError(res, messages.BAD_REQUEST, e);
    });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Error logging out");
    }
    res.clearCookie("connect.sid"); // clear the session cookie
    serverResponses.sendSuccess(res, messages.SUCCESSFUL_LOGOUT);
  });
});
module.exports = router;
