import axios from "axios";

const auth = axios.create({
  baseURL: "http://localhost:3000/api"
});

function signup(username, password) {
  return auth
    .post("/signup", {
      username,
      password
    })
    .then(response => {
      return response.data;
    });
}

function login(username, password) {
  return auth
    .post("/login", {
      username,
      password
    })
    .then(response => {
      // tell axios to always use the token
      axios.defaults.headers.common.Authorization =
        "JWT " + response.data.token;
      // save the token locally
      localStorage.setItem("jwtToken", response.data.token);
      return response.data;
    })
    .catch(err => {
      throw new Error(err.response.data);
    });
}

function secret() {
  return auth.get("/secret").then(response => {
    return response.data;
  });
}

// Retrieve the token from local storarge
const token = localStorage.jwtToken;
if (token) {
  // tell axios to use the token
  axios.defaults.headers.common.Authorization = "JWT " + token;
}

function logout() {
  localStorage.removeItem("jwtToken");
  delete axios.defaults.headers.common.Authorization;
}

export default {
  signup,
  login,
  logout,
  secret
};
