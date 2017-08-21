import Vue from "vue";
import Router from "vue-router";
import Playground from "@/Auth/Playground";
import Login from "@/Auth/Login";

Vue.use(Router);

export default new Router({
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
