import axios from "axios";
import jwt_decode from "jwt-decode";

var initialState = {
  projects: []
};

export default {
  state: {
    user: {},
    userElement:{}
  },
  mutations: {
    SET_USER(state, payload) {
      var user = payload;
      state.user = user;
    },
    SET_USER_ELEMENT(state,payload){
      state.userElement = payload;
    }
  },
  getters: {},
  actions: {
    getUser({state, commit}){
      axios.get("/api/users/"+state.user.id).then(res=>{
        commit("SET_USER_ELEMENT", res.data);
      })
    },
    setUser({ commit }, payload) {
      commit("SET_USER", payload);
    },
    setToken(context, payload) {
      var decoded = jwt_decode(payload);
      context.commit("SET_USER", decoded);
    }
  }
};
