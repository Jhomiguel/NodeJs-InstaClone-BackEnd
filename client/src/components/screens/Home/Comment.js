import React from "react";

const Comment = ({ comment }) => {
  return (
    <>
      <h6>
        <span style={{ fontWeight: "500" }}>{comment.postedBy.name} </span>
        {comment.text}
      </h6>
    </>
  );
};

export default Comment;
