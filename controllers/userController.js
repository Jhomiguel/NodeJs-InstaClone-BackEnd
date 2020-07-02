const moongose = require("mongoose");
require("../models/user");
require("../models/posts");
const User = moongose.model("User");
const Post = moongose.model("Posts");

exports.searchUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((error, post) => {
          if (error) return res.status(422).json({ error });
          res.json({ user, post });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(404).json({ error: "User Not Found" });
    });
};

exports.followUser = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (error, followerResult) => {
      if (error) return res.status(422).json({ error });
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((followingResult) => {
          res.json(followingResult);
        })
        .catch((error) => {
          if (error) return res.status(422).json({ error });
        });
    }
  );
};

exports.unfollowUser = (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (error) => {
      if (error) return res.status(422).json({ error });

      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json({ result });
        })
        .catch((error) => {
          if (error) return res.status(422).json({ error });
        });
    }
  );
};

exports.updateProfilePic = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (error, result) => {
      if (error) return res.status(422).json({ error });
      res.json({ result, msg: "Profile Pic updated sucessfully" });
    }
  );
};
exports.searchUsers = (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  User.find({ email: { $regex: userPattern } })
    .then((users) => {
      if (!users) return res.status(404).json({ msg: "User doesnt found" });

      res.json(users);
    })
    .catch((error) => {
      console.log(error);
    });
};
