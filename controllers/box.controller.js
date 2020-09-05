const mongoose = require("mongoose");
const Box = require("../models/box.model");
const User = require("../models/user.model");

module.exports.all = (req, res, next) => {
  res.render("boxes/all", { 
  title: 'View all boxes',
  boxes:  req.currentUser.boxes
});
};

module.exports.newBox = (req, res, next) => {
  res.render('boxes/new', { 
    title: 'Add new box',
    user: req.currentUser
  })
};

module.exports.create = (req, res, next) => {
  const box = new Box({
    ...req.body,
    user: req.currentUser._id.toString(),
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
  Box.findById({user: req.currentUser._id.toString(), _id: req.params.id})
    .populate("user")
    .populate("storage")
    .populate("product")
    .then((box) => {
      res.render("boxes/show", { box });
    })
    .catch(next);
};

module.exports.viewEdit = (req, res, next) => {
  Box.findById(req.params.id)
  .then(box => {
    res.render("boxes/edit", {
      title: 'Edit new box',
      box,
      user: req.currentUser
    })
  })
  .catch(next)
};

module.exports.update = (req, res, next) => {
  const body = req.body;
  Box.findById(req.params.id)
    .then(box => {
      if (box.user.toString() === req.currentUser._id.toString()) {
        box.set(body);
        console.log(body)
        box.save()
          .then(() => {
            res.redirect(`/boxes/${box._id}`);
          })
          .catch(next);
      } else {
        res.redirect(`/boxes/${req.params.id}/edit`)
      }
    })
    .catch(next)
};

module.exports.delete = (req, res, next) => {
  req.box
    .remove()
    .then(() => {
      res.redirect("/boxes");
    })
    .catch(next);
};
