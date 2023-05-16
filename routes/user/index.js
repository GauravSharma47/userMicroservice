const express = require("express");
const router = express.Router();
const serverResponses = require("../../utils/helpers/responses");
const messages = require("../../config/messages");
const { User } = require("../../models/user");

router.post("/", (req, res) => {
  const user = new User({
    name: req.body.name,
    phone: req.body.phone,
  });
  user
    .save()
    .then((result) => {
      serverResponses.sendSuccess(res, messages.SUCCESSFUL, result);
    })
    .catch((e) => {
      serverResponses.sendError(res, messages.BAD_REQUEST, e);
    });
});

router.get("/", (req, res) => {
  User.find({})
    .then((users) => {
      serverResponses.sendSuccess(res, messages.SUCCESSFUL, users);
    })
    .catch((e) => {
      serverResponses.sendError(res, messages.BAD_REQUEST, e);
    });
});

router.get("/:id", (req, res) => {
  if (req.session.userId) {
    console.log('is new ',req.session);
    User.findOne({ _id: req.params.id })
      .then((users) => {
        serverResponses.sendSuccess(res, messages.SUCCESSFUL, users);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  }else{
    serverResponses.sendError(res, messages.AUTHENTICATION_FAILED);
  }
});

router.put("/:id", (req, res) => {
  User.updateOne({ _id: req.params.id }, { ...req.body })
    .then((users) => {
      serverResponses.sendSuccess(res, messages.SUCCESSFUL, users);
    })
    .catch((e) => {
      serverResponses.sendError(res, messages.BAD_REQUEST, e);
    });
});

router.delete("/:id", (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then((users) => {
      serverResponses.sendSuccess(res, messages.SUCCESSFUL, users);
    })
    .catch((e) => {
      serverResponses.sendError(res, messages.BAD_REQUEST, e);
    });
});

module.exports = router;
