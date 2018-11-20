import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import userStore from "./user";
import moment from "moment";

Vue.use(Vuex);

function initialState() {
  return {
    percentLoaded: 0,
    shop: {},
    user: {},
    quantity: 0,
    activeListings: [],
    dateFrom: (() => moment().subtract(30, "days")._d)(),
    dateTo: (() => moment()._d)()
  };
}

export default new Vuex.Store({
  state: {
    percentLoaded: 0,
    shop: {},
    user: {},
    quantity: 0,
    activeListings: [],
    dateFrom: (() => moment().subtract(30, "days")._d)(),
    dateTo: (() => moment()._d)()
  },
  modules: {
    userStore
  },
  plugins: [createPersistedState()],
  mutations: {
    SET_DATE_FROM(state, payload) {
      state.dateFrom = payload;
    },
    SET_DATE_TO(state, payload) {
      state.dateTo = payload;
    },
    SET_PERCENT_LOADED(state, payload) {
      state.percentLoaded = payload;
    },
    SET_SHOP(state, payload) {
      state.shop = payload;
    },
    SET_QUANTITY(state, payload) {
      state.quantity = payload;
    },
    SET_ACTIVE_LISTINGS(state, payload) {
      state.activeListings = payload;
    },
    reset(state) {
      const s = initialState();
      Object.keys(s).forEach(key => {
        state[key] = s[key];
      });
    }
  },
  actions: {
    setDateFrom({ commit }, payload) {
      commit("SET_DATE_FROM", payload);
    },
    setDateTo({ commit }, payload) {
      commit("SET_DATE_TO", payload);
    },
    setPercentLoaded({ commit }, payload) {
      commit("SET_PERCENT_LOADED", payload);
    },
    setShop({ commit }, payload) {
      window.localStorage.setItem("shopId", payload.shop_id);
      commit("SET_SHOP", payload);
    },
    setQuantity({ commit }, payload) {
      commit("SET_QUANTITY", payload);
    },
    setActiveListings({ commit }, payload) {
      commit("SET_ACTIVE_LISTINGS", payload);
    }
  }
});
