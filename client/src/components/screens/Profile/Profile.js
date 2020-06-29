import React, { useEffect, useState, useContext } from "react";
import Item from "./Item";
import M from "materialize-css";
import { userContext } from "../../../App";

const Profile = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(userContext);
  const [img, setImage] = useState("");

  useEffect(() => {
    const fetchData = () => {
      fetch("/myposts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setData(res.myposts);
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (img) {
      const updateProfilePic = async () => {
        const data = new FormData();
        data.append("file", img);
        data.append("upload_preset", "instagram-clone");
        data.append("cloud_name", "dqmwap2ye");
        await fetch("https://api.cloudinary.com/v1_1/dqmwap2ye/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            fetch("/updateprofilePic", {
              method: "put",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
              body: JSON.stringify({ pic: data.url }),
            })
              .then((res) => res.json())
              .then((data) => {
                localStorage.setItem(
                  "user",
                  JSON.stringify({ ...state, pic: data.result.pic })
                );
                dispatch({ type: "UPDATE_PIC", payload: data.result.pic });
                M.toast({ html: data.msg, classes: "#00c853 green accent-4" });
              });
          })
          .catch((error) => console.log(error));
      };
      updateProfilePic();
    }
  }, [img]);

  const handleChangeProfilePic = (file) => {
    setImage(file);
  };
  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>
            <img
              style={{ width: "160px", height: "160px", borderRadius: "80px" }}
              alt="profile"
              src={state ? state.pic : "Loading"}
            />
          </div>

          <div>
            <h4>{state ? state.name : "Loading"}</h4>
            <h5>{state ? state.email : "Loading"}</h5>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "108%",
              }}
            >
              <h6>
                {data.length > 1
                  ? `${data.length} posts`
                  : `${data.length} post`}
              </h6>
              <h6>{state ? state.followers.length : "0"} followers</h6>
              <h6>{state ? state.following.length : "0"} following</h6>
            </div>
          </div>
        </div>
        <div
          style={{ margin: "10px 0px 10px 25px" }}
          className="file-field input-field"
        >
          <div className="btn waves-effect waves-light #1e88e5 blue darken-1">
            <span>Update Profile Pic</span>
            <input
              type="file"
              name="picture"
              onChange={(e) => {
                handleChangeProfilePic(e.target.files[0]);
              }}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>

      <div className="gallery">
        {data.map((pic) => (
          <Item key={pic._id} pic={pic} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
