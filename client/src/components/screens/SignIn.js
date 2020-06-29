import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { userContext } from "../../App";
const SignIn = () => {
  const { state, dispatch } = useContext(userContext);
  const history = useHistory();
  const [userdata, setUserData] = useState({
    email: "",
    password: "",
  });
  const { password, email } = userdata;

  const handleChange = (e) => {
    setUserData({
      ...userdata,
      [e.target.name]: e.target.value,
    });
  };

  const postData = () => {
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userdata),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#d32f2f red darken-2" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({ html: data.msg, classes: "#00c853 green accent-4" });
          history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <h4>Sign In</h4>
        <input
          type="text"
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
        <button
          className="btn waves-effect waves-light #1e88e5 blue darken-1 btn-lg"
          type="submit"
          onClick={postData}
        >
          Login
        </button>
        <h5>
          <Link to="signup">Dont have an account?</Link>
        </h5>
      </div>
    </div>
  );
};

export default SignIn;
