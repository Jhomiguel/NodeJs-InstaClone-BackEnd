import React, { useEffect, useState } from "react";
import Item from "./Item";

const Posts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getAllPosts = () => {
      fetch("/allposts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setData(res.posts);
        });
    };
    getAllPosts();
  }, []);

  return (
    <div className="home">
      {data.map((post) => (
        <Item key={post._id} post={post} data={data} setData={setData} />
      ))}
    </div>
  );
};

export default Posts;
