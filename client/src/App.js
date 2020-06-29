import React, { useEffect, createContext, useReducer, useContext } from "react";
import NavBar from "./components/NavBar";
//router
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
//screens
import AllPosts from "./components/screens/Home/Posts";
import SubsPosts from "./components/screens/Home/SubscribesUserPosts";
import Profile from "./components/screens/Profile/Profile";
import UserProfile from "./components/screens/Profile/UserProfile";
import SignIn from "./components/screens/SignIn";
import SignUp from "./components/screens/SignUp";
import CreatePost from "./components/screens/CreatePost";
//Reducer
import { reducer, initialState } from "./reducers/userReducer";
import Posts from "./components/screens/Home/Posts";

export const userContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/signin");
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <SubsPosts />
      </Route>
      <Route path="/allposts">
        <AllPosts />
      </Route>
      <Route path="/signin">
        <SignIn />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/profile/:id">
        <UserProfile />
      </Route>
      <Route path="/createpost">
        <CreatePost />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <userContext.Provider value={{ state, dispatch }}>
      <Router>
        <NavBar />
        <Routing />
      </Router>
    </userContext.Provider>
  );
}

export default App;
