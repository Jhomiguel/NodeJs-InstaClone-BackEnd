const moongose = require("mongoose");
require("../models/posts");
const Post = moongose.model("Posts");

exports.createPost = (req, res) => {
  const { title, body, imgurl } = req.body;

  if (!title || !body || !imgurl) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: imgurl,
    postedBy: req.user,
  });

  post
    .save()
    .then((result) => {
      res.json({
        post: result,
        msg: "Your post have been uploaded successfully",
      });
    })
    .catch((error) => {
      res.json({
        msg: error,
      });
    });
};

exports.getAllPosts = (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "name")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getUserPosts = (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("PostedBy", "_id name")
    .then((myposts) => {
      res.json({ myposts });
    })
    .catch((error) => {
      console.log(error);
    });
};
exports.getFollowingPosts = (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "name")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.LikePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .exec((error, result) => {
      if (error) return res.status(422).json({ error: error });

      res.json(result);
    });
};

exports.unLikePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { unlikes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .exec((error, result) => {
      if (error) return res.status(422).json({ error: error });

      res.json(result);
    });
};

exports.commentPost = (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((error, result) => {
      if (error) return res.status(422).json({ error: error });

      res.json(result);
    });
};

exports.deletePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      res.status(400).json({ msg: "Post not found" });
    }

    await Post.findByIdAndRemove({ _id: req.params.id });
    res.json({ msg: "Post has been removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
