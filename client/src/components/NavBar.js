import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../App";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

const NavBar = () => {
  const { state, dispatch } = useContext(userContext);
  const history = useHistory();

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right hide-on-med-Linknd-down">
          {state ? (
            <>
              <li>
                <Link to="/allposts">All Posts</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/createpost">Make a post</Link>
              </li>
              <li>
                <button
                  className="btn waves-effect waves-light #f44336 red"
                  type="submit"
                  onClick={() => {
                    localStorage.clear();
                    dispatch({ type: "LOGOUT" });
                    history.push("/signin");
                    M.toast({
                      html: "Cya later",
                      classes: "#d32f2f red darken-2",
                    });
                  }}
                >
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signin">Sign In</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
