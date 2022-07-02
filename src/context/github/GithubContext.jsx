import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();
const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);
  //fetchUser for testing API whether we can fetch users. Not using
  const searchUsers = async (text) => {
    setLoading();
    const params = new URLSearchParams({
      q: text,
    });
    const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });
    // console.log("This is a response", response);
    const { items } = await response.json(); //await response.json.item
    // console.log(items);
    dispatch({
      type: "GET_USERS",
      payload: items,
    });
  };

  //Get single user
  const getUser = async (login) => {
    setLoading();
    // console.log("This is login" ,login);
    const response = await fetch(`${GITHUB_URL}/users/${login}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });
    // console.log("This is response" , response);
    if (response.status === 404) {
      window.location = "/notfound";
    } else {
      const data = await response.json(); //await response.json.item
      // console.log("This is data", data);
      dispatch({
        type: "GET_USER",
        payload: data,
      });
    }
  };

  //Fetch the repos
  const getUserRepos = async (login) => {
    setLoading();
    const params = new URLSearchParams({
      q: 'user:' + login,
      per_page:10,
    });
    const response = await fetch(
      `${GITHUB_URL}/search/repositories?${params}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );
    console.log(response.url);
    // console.log(`${GITHUB_URL}/search/repositories?${params}`); 
    const {items} = await response.json(); //await response.json.item
    console.log("getUsersTopRepos", items);
    dispatch({
      type: "GET_REPOS",
      payload: items,
    });
  };

  //clear users
  const clearUsers = () => dispatch({ type: "CLEAR_USERS" });

  const setLoading = () => dispatch({ type: "SET_LOADING" });
  return (
    <GithubContext.Provider
      value={{
        searchUsers,
        users: state.users,
        user: state.user,
        loading: state.loading,
        repos: state.repos,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
