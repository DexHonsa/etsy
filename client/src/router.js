import Vue from "vue";
import Router from "vue-router";
import Connect from "./components/connect";
import Login from "./components/login";
import Header from "./components/header";
import Listings from "./components/listings";
import Signup from "./components/signup";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "login",
      components: {
        default: Login,
        header: Header
      }
    },
    {
      path: "/signup",
      name: "signup",
      components: {
        default: Signup,
        header: Header
      }
    },
    {
      path: "/connect",
      name: "Connect",
      components: {
        default: Connect,
        header: Header
      }
    },
    {
      path: "/listings",
      name: "listings",
      components: {
        default: Listings,
        header: Header
      }
    }
  ]
});
