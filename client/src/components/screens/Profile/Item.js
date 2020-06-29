import React from "react";

const Item = ({ pic }) => {
  const { photo, title } = pic;
  return (
    <img
      style={{ width: "200px", height: "200px" }}
      className="item"
      src={photo}
      alt={title}
    />
  );
};

export default Item;
