import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const SignUp = () => {
  const history = useHistory();
  const [userdata, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    imgurl: undefined,
  });
  const [img, setImage] = useState("");
  const { password, email, name, imgurl } = userdata;

  useEffect(() => {
    if (imgurl) {
      uploadFields();
    }
  }, [imgurl]);

  const handleChange = (e) => {
    setUserData({
      ...userdata,
      [e.target.name]: e.target.value,
    });
  };
  const uploadProfilePic = async () => {
    //cloudinary upload
    const data = new FormData();
    data.append("file", img);
    data.append("upload_preset", "instagram-clone");
    data.append("cloud_name", "dqmwap2ye");
    await fetch("https://api.cloudinary.com/v1_1/dqmwap2ye/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setUserData({ ...userdata, imgurl: data.url }))
      .catch((error) => console.log(error));
  };
  const uploadFields = () => {
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userdata),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#d32f2f red darken-2" });
        } else {
          M.toast({ html: data.msg, classes: "#00c853 green accent-4" });
          history.push("/signin");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const postData = () => {
    if (img) {
      uploadProfilePic();
    } else {
      uploadFields();
    }
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <h4>Sign Up</h4>
        <input
          type="text"
          placeholder="name"
          name="name"
          value={name}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          name="email"
          value={email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          value={password}
          onChange={handleChange}
        />

        <div className="file-field input-field ">
          <div className="btn waves-effect waves-light #1e88e5 blue darken-1">
            <span
              style={{
                fontFamily: " sans-serif",
              }}
            >
              Upload Profile Pic
            </span>
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
          onClick={postData}
        >
          Login
        </button>
        <h5>
          <Link to="signin">Already have an account?</Link>
        </h5>
      </div>
    </div>
  );
};

export default SignUp;
