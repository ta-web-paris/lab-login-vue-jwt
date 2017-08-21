import axios from "axios";

const auth = axios.create({
  baseURL: "http://localhost:3000/api"
});

function signup(user) {
  return auth.post("/signup", user).then(response => {
    return response.data;
  });
}

function login(username, password, vm) {
  return auth
    .post("/login", {
      username,
      password
    })
    .then(response => {
      // tell axios to always use the token
      const { token, name } = response.data;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("user.name", name);
      loadUser(vm);
      return response.data;
    });
}

function secret() {
  return auth.get("/secret").then(response => {
    return response.data;
  });
}

function loadUser(vm) {
  const token = localStorage.jwtToken;
  const name = localStorage["user.name"];
  if (token) {
    // tell axios to use the token
    axios.defaults.headers.common.Authorization = "Bearer " + token;
    vm.$root.user = {
      token,
      name
    };
  }
}

function logout(vm) {
  localStorage.removeItem("jwtToken");
  delete axios.defaults.headers.common.Authorization;
  vm.$root.user = null;
}

export default {
  signup,
  login,
  logout,
  secret,
  loadUser
};
