import React, { useContext } from "react";
import { userContext } from "../../../App";
import Comment from "./Comment";
import M from "materialize-css";
import { Link } from "react-router-dom";
const Item = ({ post, data, setData }) => {
  const { body, photo, postedBy, title, likes, unlikes, _id, comments } = post;
  const { state, dispatch } = useContext(userContext);

  const likePost = (id) => {
    if (likes.includes(state._id)) {
      return console.log("ya dio like");
    } else {
      fetch("/like", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          postId: id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          const newData = data.map((post) => {
            if (post._id === result._id) {
              return result;
            } else {
              return post;
            }
          });
          setData(newData);
        })
        .catch((error) => console.log(error));
    }
  };
  const unlikePost = (id) => {
    if (unlikes.includes(state._id)) {
      return console.log("ya dio dislike");
    } else {
      fetch("/unlike", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          postId: id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          const newData = data.map((post) => {
            if (post._id === result._id) {
              return result;
            } else {
              return post;
            }
          });
          console.log(result);
          setData(newData);
        })
        .catch((error) => console.log(error));
    }
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((post) => {
          if (post._id === result._id) {
            return result;
          } else {
            return post;
          }
        });
        setData(newData);
      })
      .catch((error) => console.log(error));
  };

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        const newData = data.filter((post) => {
          return post._id !== postId;
        });
        setData(newData);
        M.toast({ html: response.msg, classes: "#d32f2f red darken-2" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="card home-card">
      <h5 style={{ textAlign: "center" }}>
        <Link
          to={
            postedBy._id !== state._id ? `/profile/${postedBy._id}` : "/profile"
          }
        >
          {postedBy.name}
        </Link>
        {postedBy._id === state._id && (
          <i
            className="material-icons"
            style={{ color: "red", float: "right" }}
            onClick={() => deletePost(_id)}
          >
            delete
          </i>
        )}
      </h5>

      <div className="card-image">
        <img alt="post" src={photo} />
      </div>
      <div className="card-content" style={{ margin: "5px" }}>
        <i className="material-icons" style={{ color: "red" }}>
          favorite
        </i>
        <i className="material-icons" onClick={() => likePost(_id)}>
          thumb_up
        </i>
        <i className="material-icons" onClick={() => unlikePost(_id)}>
          thumb_down
        </i>
        <h6>{likes.length} likes</h6>
        <h6> {unlikes.length} unlikes</h6>
        <h6>{title}</h6>
        <p>{body}</p>
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            makeComment(e.target[0].value, _id);
            e.target[0].value = "";
          }}
        >
          <input type="text" placeholder="add a comment" />
        </form>
      </div>
    </div>
  );
};

export default Item;
