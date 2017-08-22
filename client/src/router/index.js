import Vue from "vue";
import Router from "vue-router";
import Playground from "@/Auth/Playground";
import Login from "@/Auth/Login";
import LoginCallback from "@/Auth/LoginCallback";

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      name: "auth-playground",
      component: Playground
    },
    {
      path: "/login",
      name: "login",
      component: Login
    }
  ]
});
