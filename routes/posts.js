const express = require("express");
const postController = require("../controllers/postController");
const auth = require("../middleware/auth");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getUserPosts,
  LikePost,
  unLikePost,
  commentPost,
  deletePost,
  getFollowingPosts,
} = postController;

router.post("/createpost", auth, createPost);
router.get("/allposts", getAllPosts);
router.get("/myposts", auth, getUserPosts);
router.put("/like", auth, LikePost);
router.put("/unlike", auth, unLikePost);
router.put("/comment", auth, commentPost);
router.delete("/deletepost/:id", auth, deletePost);
router.get("/followingposts", auth, getFollowingPosts);

module.exports = router;
