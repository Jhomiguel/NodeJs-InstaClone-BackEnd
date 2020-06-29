import React, { useEffect, useState, useContext } from "react";
import Item from "./Item";
import { userContext } from "../../../App";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { state, dispatch } = useContext(userContext);
  const [data, setData] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [consult, setConsult] = useState(true);
  const { id } = useParams();
  const [currentlyfollowing, setcurrentlyFollowing] = useState(
    state ? state.following.includes(id) : false
  );

  useEffect(() => {
    const fetchData = () => {
      fetch(`/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setData(data.post);
          setUserData(data.user);
        });
    };

    if (consult) {
      fetchData();
      setConsult(false);
    }
  }, [consult]);

  const followUser = () => {
    fetch(`/follow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        followId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: {
            following: userdata.followers,
            followers: userdata.following,
          },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserData((prevState) => {
          return { ...prevState, data };
        });
        setConsult(true);
        setcurrentlyFollowing(true);
      });
  };

  const unfollowUser = () => {
    fetch(`/unfollow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        unfollowId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: {
            following: userdata.following,
            followers: userdata.followers,
          },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserData((prevState) => {
          return { ...prevState, data };
        });
        setConsult(true);
        setcurrentlyFollowing(false);
      });
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            alt="profile"
            src={userdata ? userdata.pic : "Loading"}
          />
        </div>
        <div>
          <h4>{userdata ? userdata.name : "Loading"}</h4>
          <h5>{userdata ? userdata.email : "Loading"}</h5>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6>
              {data.length > 1 ? `${data.length} posts` : `${data.length} post`}
            </h6>
            <h6>
              {userdata.followers ? userdata.followers.length : "loading"}{" "}
              followers
            </h6>
            <h6>
              {userdata.following ? userdata.following.length : "loading"}{" "}
              following
            </h6>
          </div>
          {currentlyfollowing ? (
            <button
              style={{ margin: "10px" }}
              className="btn waves-effect waves-light #1e88e5 blue darken-1"
              type="submit"
              onClick={() => unfollowUser()}
            >
              Unfollow
            </button>
          ) : (
            <button
              style={{ margin: "10px" }}
              className="btn waves-effect waves-light #1e88e5 blue darken-1"
              type="submit"
              onClick={() => followUser()}
            >
              Follow
            </button>
          )}
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

export default UserProfile;
