import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

const CreatePost = () => {
  const [postdata, setPostData] = useState({
    title: "",
    body: "",
    imgurl: "",
  });
  const [image, setImage] = useState({});

  const { title, body, imgurl } = postdata;

  const history = useHistory();

  const HandlePostData = async () => {
    //cloudinary upload
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "instagram-clone");
    data.append("cloud_name", "dqmwap2ye");
    await fetch("https://api.cloudinary.com/v1_1/dqmwap2ye/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setPostData({ ...postdata, imgurl: data.url }))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    const postDataOnMongo = async () => {
      //MongoDB
      if (imgurl) {
        await fetch("/createpost", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify(postdata),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.error) {
              M.toast({ html: data.error, classes: "#d32f2f red darken-2" });
            } else {
              M.toast({ html: data.msg, classes: "#00c853 green accent-4" });
              history.push("/");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };
    postDataOnMongo();
  }, [imgurl]);

  const handleChange = (e) => {
    setPostData({
      ...postdata,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="card input-filed"
      style={{
        margin: "40px auto",
        maxWidth: "700px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h3 className="font">Posting</h3>
      <input
        type="text"
        placeholder="title"
        name="title"
        value={title}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="body"
        name="body"
        value={body}
        onChange={handleChange}
      />

      <div className="file-field input-field ">
        <div className="btn #0d47a1 blue darken-1">
          <span>Upload an image</span>
          <input
            type="file"
            name="picture"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #1e88e5 blue darken-1 btn-lg"
        type="submit"
        onClick={HandlePostData}
      >
        Submit Post
      </button>
    </div>
  );
};

export default CreatePost;
