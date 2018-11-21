import axios from "axios";
import jwt_decode from "jwt-decode";
import store from "./store";

export default {
  user: {
    authenticated: false
  },
  login(creds) {
    return new Promise((resolve, reject) => {
      axios.post("/api/login", creds).then(
        res => {
          localStorage.setItem("token", res.data.token);
          this.user.authenticated = true;

          var decoded = jwt_decode(res.data.token);
          store.dispatch("setUser", decoded);
          store.dispatch("getUser");
          resolve(decoded);
        },
        err => {
          reject(err);
        }
      );
    });
  },
  getHeaders() {
    var token = localStorage.getItem("token");
    var headers = {
      Accept: "application/json",
      Authorization: "Bearer " + token
    };
    return headers;
  },
  checkAuth() {
    var jwt = localStorage.getItem("token");
    if (jwt) {
      this.user.authenticated = true;
    } else {
      this.user.authenticated = false;
    }
  },
  logout() {
    localStorage.removeItem("token");
    this.user.authenticated = false;
    store.dispatch("setUser", {});
    store.commit("reset");
    setTimeout(() => {
      window.location.reload();
    }, 200);
  },
  unlinkAccount(){
    return new Promise((resolve, reject)=>{
      var data = {
        userId:store.state.userStore.user.id,
        update:{
          token:null,
          secret:null
        }
      }
      axios.put("/api/update_user",data).then(()=>{
        resolve();
      }, ()=>{
        reject();
      })
    })
    
  }
};
