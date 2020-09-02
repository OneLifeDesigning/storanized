const mongoose = require("mongoose");
const Box = require("../models/box.model");
const User = require("../models/user.model");

module.exports.all = (req, res, next) => {
  Box.find()
    .populate("user")
    .populate("storage")
    .then((boxes) => {
      //res.render("boxes/all", { boxes });
      res.json(boxes)
    })
    .catch(next);
};

module.exports.newBox = (req, res, next) => {
  res.render("boxes/new");
};

module.exports.create = (req, res, next) => {
  const box = new Box({
    ...req.body,
  });

  box
    .save()
    .then((box) => {
      res.redirect(`/boxes/${box._id}`);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("boxes/new", { error: error.errors, box });
      } else {
        next(error);
      }
    });
};

module.exports.view = (req, res, next) => {
  Box.findById(req.params.id)
    .populate("user")
    .populate("storage")
    .then((box) => {
      res.render("boxes/view", { box });
    })
    .catch(next);
};

module.exports.viewEdit = (req, res, next) => {
    res.render("boxes/edit");
};

module.exports.update = (req, res, next) => {
  const body = req.body;
  const box = req.box;

  box.set(body);
  box
    .save()
    .then(() => {
      res.redirect(`/boxes/${box._id}`);
    })
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  req.box
    .remove()
    .then(() => {
      res.redirect("/boxes");
    })
    .catch(next);
};
