<template>
    <div style="position:relative; min-height:100vh">
        
        <div class="content container">
          <div v-if="Object.keys(shop).length != 0" class="global-options-container" style="z-index:100000;">
              <div class="date-selectors">
                  <div class="standard-input-item" :class="{'active':dateFrom.length != ''}">
                  <div class="date-picker-title" :class="{'active':dateFrom.length != ''}">Date From</div>
                  <datepicker @selected="changeDateFrom" :highlighted="highlighted" ref="date_from" name="date_from" :value="dateFrom"  input-class="standard-input date-input "></datepicker>
                  </div>
                  <div class="standard-input-item" :class="{'active':dateTo.length != ''}">
                  <div class="date-picker-title" :class="{'active':dateTo.length != ''}">Date To</div>
                  <datepicker @selected="changeDateTo" :highlighted="highlighted" ref="date_to" name="date_to" :value="dateTo"  input-class="standard-input date-input "></datepicker>
                  </div>
              </div>
          </div>
            <div class="shop-title" v-if="Object.keys(shop).length > 0">
              <img style="width:100px; height:100px;" v-if="Object.keys(shop).length > 0" :src="shop.icon_url_fullxfull" alt="">
              <div class="shop-details">
                {{shop.shop_name}}<br>
                <span style="font-size:10pt; color:#808080; font-weight:lighter">{{shop.shop_id}}</span>
              </div>
              
            </div>
            <div v-if="Object.keys(shop).length != 0" class="ticker-container">
              <!-- <button @click="switchAll">View All / Not Shipped</button> -->
              <div class="tabs">
                <div @click="switchAll(0)" class="tab" :class="{'active':viewing_all_receipts}">All
                  <div class="tab-bar"></div>
                </div>
                <div @click="switchAll(1)" class="tab" :class="{'active':!viewing_all_receipts}">Not Shipped
                  <div class="tab-bar"></div>
                </div>
              </div>
              <!-- <StandardSelect
                field=""
                name="changer"
                width="400px"
                :options="[{label:'View All',value:'all'},{label:'View Not Shipped',value:'not_shipped'}]"
                :value="{label:'View All',value:'all'}"
                :onChange="switchAll"
               /> -->
              <div class="big-ticker">
                <img class="spin" v-if="!allLoaded" src="../img/spinner.svg" alt="">
                <div v-if="allLoaded" id="value0"></div>
              </div>
              
              <div class="big-ticker-title">
                <span v-if="!viewing_all_receipts">Total Quantity Not Shipped</span>
                <span v-if="viewing_all_receipts">Total Quantity All Time</span>
                </div><br>
              <transition 
              enter-active-class="fadeInUp"
              leave-active-class="fadeInDown"
              >
              <button class="refresh animated-fast" v-if="allLoaded" @click="refresh">Refresh</button>
              </transition>
            </div>
            
            <div v-if="Object.keys(shop).length != 0" class="receipts">

              <div class="drill-metrics-container">
                <div class="drill-metric">
                  <div class="drill-metric-title">Total Orders</div>
                  <div class="drill-metric-value">
                    <div v-if="allLoaded" id="value1">{{this.receipts.length}}</div>
                    <img class="spin" v-if="!allLoaded" src="../img/spinner.svg" alt="">
                    </div>
                </div>
                <div class="drill-metric">
                  <div class="drill-metric-title">Orders</div>
                  <div class="drill-metric-value">
                    <div v-if="allLoaded" id="value2">{{this.filteredReceipts.length}}</div>
                    <img class="spin" v-if="!allLoaded" src="../img/spinner.svg" alt="">
                    </div>
                  
                </div>
                <div class="drill-metric">
                  <div class="drill-metric-title">Total Sales</div>
                  <div class="drill-metric-value">
                    <div v-if="allLoaded" id="value3">$ {{totalSales.toLocaleString()}}</div>
                    <img class="spin" v-if="!allLoaded" src="../img/spinner.svg" alt="">
                    </div>
                </div>

                <div class="drill-metric">
                  <div class="drill-metric-title">Total Revenue</div>
                  <div class="drill-metric-value">
                    <div v-if="allLoaded" id="value4">$ {{totalRevenue.toLocaleString()}}</div>
                    <img class="spin" v-if="!allLoaded" src="../img/spinner.svg" alt="">
                    </div>
                </div>
                
              </div>
              <transition 
              enter-active-class="fadeInUp"
              leave-active-class="fadeInDown"
              >
              <Table v-if="transLoaded" :receipts="filteredReceipts"/>
              </transition>
            </div>
             
        </div>
        <transition 
              enter-active-class="fadeInUp"
              leave-active-class="fadeInDown"
              >
        <div class="button-container">
          <div v-if="Object.keys(shop).length == 0" style="max-width:80%; width:100%; font-size:13pt; margin:15px; text-align:center;">
          To get started, link your Etsy account to get sales information about your account.
          </div>
          <button v-if="Object.keys(shop).length == 0" @click="auth"><i style="margin-right:10px;" class="fal fa-link"></i>  Link Etsy Account</button>
        </div>
        </transition>
        <div class="terms">The term 'Etsy' is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy.</div>
       
    </div>
</template>
<script>
// /* eslint-disable */
import Table from "./sales_table";
import axios from "axios";
import Promise from "bluebird";
import Datepicker from "vuejs-datepicker";
import VueOdometer from "v-odometer/src";
import StandardSelect from "./form_elements/custom_select";
import moment from "moment";
import { mapActions } from "vuex";
export default {
  name: "login",
  data() {
    return {
      allLoaded: false,
      message: "",
      etsyId: "",
      shopId: "",
      etsyUser: {},
      receipts: [],
      all_receipts: [],
      viewing_all_receipts: true,
      trans: [],
      filteredReceipts: [],
      filteredTrans: [],
      total: 0,
      totalQuantity: 0,
      receiptsLoaded: false,
      transLoaded: false,
      bigTickerEl: ""
    };
  },
  mounted() {
    var that = this;
    this.setPercentLoaded(0);
    if (this.user.token != null) {
      this.$router.push({
        query: { token: this.user.token, secret: this.user.secret }
      });
      // if (Object.keys(this.shop).length == 0) {
      init();
      // } else {
      //   this.allLoaded = true;
      //   setTimeout(() => {
      //     this.addOdometer(this.quantity, 0, "train-station");
      //   }, 100);
      // }
    } else {
      //if (Object.keys(this.shop).length == 0) {
      init();
      // } else {
      //   this.allLoaded = true;
      //   setTimeout(() => {
      //     this.addOdometer(this.quantity, 0, "train-station");
      //   }, 100);
      // }
    }

    function init() {
      that.getSelf().then(() => {
        that.getShop().then(() => {
          if (that.user.token == null) {
            that.updateUser({
              userId: that.user.id,
              update: {
                token: that.token,
                secret: that.secret
              }
            });
          }
          that.getAllReceipts().then(() => {
            that.getAllTransactions().then(() => {
              that.filterReceipts();
              that.filterTransactions();
              that.getSales();
              that.getQuantity();
            });
          });
        });
      });
    }
  },
  methods: {
    ...mapActions([
      "setPercentLoaded",
      "setShop",
      "setQuantity",
      "setDateFrom",
      "setDateTo",
      "getUser"
    ]),

    updateUser(data) {
      axios.put("/api/update_user", data).then(() => {
        console.log("updated user yay");
      });
    },
    getSelf() {
      return new Promise((resolve, reject) => {
        var data = {
          token: this.token,
          secret: this.secret
        };
        axios.post("/api/get_self", data).then(
          res => {
            this.etsyUser = res.data.results[0];
            this.etsyId = res.data.results[0].user_id;
            resolve();
          },
          err => {
            console.log(err);
            reject();
          }
        );
      });
    },
    getShop() {
      var data = {
        token: this.token,
        secret: this.secret,
        userId: this.etsyId
      };
      return new Promise((resolve, reject) => {
        axios.post("/api/get_shops", data).then(
          res => {
            this.shopId = res.data.results[0].shop_id;
            this.setShop(res.data.results[0]);
            resolve();
          },
          err => {
            console.log(err);
            reject();
          }
        );
      });
    },
    getAllReceipts() {
      var data = {
        token: this.token,
        secret: this.secret,
        shopId: this.shopId,
        page: 1
      };
      return new Promise((resolve, reject) => {
        axios.post("/api/get_all_receipts", data).then(res => {
          var receipts = res.data.results;

          //  if (res.data.count > 100) {
          var promises = [];
          var pages = Math.ceil(res.data.count / 100);
          for (var i = 2; i <= pages; i++) {
            data.page = i;
            promises.push(
              axios.post("/api/get_all_receipts", {
                token: data.token,
                secret: data.secret,
                shopId: data.shopId,
                page: i
              })
            );
          }
          Promise.map(
            promises,
            promise => {
              this.setPercentLoaded(30);
              receipts.push(...promise.data.results);
            },
            { concurrency: 10 }
          ).then(() => {
            this.receipts = receipts.map(rec => {
              return {
                receipt_id: rec.receipt_id,
                total_price: rec.total_price,
                was_shipped: rec.was_shipped,
                was_paid: rec.was_paid,
                total_shipping_cost: rec.total_shipping_cost,
                name: rec.name,
                creation_tsz: rec.creation_tsz,
                adjusted_grandtotal: rec.adjusted_grandtotal,
                shipping_details: {
                  shipping_method: rec.shipping_details.shipping_method
                }
              };
            });

            this.setPercentLoaded(90);
            console.log("finished receipts");

            this.receiptsLoaded = true;
            resolve();
          });
          //  }
        });
      });
    },
    getAllTransactions() {
      var data = {
        token: this.token,
        secret: this.secret,
        shopId: this.shopId,
        page: 1
      };
      return new Promise((resolve, reject) => {
        axios.post("/api/get_trans", data).then(res => {
          var trans = res.data.results;
          // if (res.data.count > 100) {
          var promises = [];
          var pages = Math.ceil(res.data.count / 100);
          for (var i = 2; i <= pages; i++) {
            data.page = i;
            promises.push(
              axios.post("/api/get_trans", {
                token: data.token,
                secret: data.secret,
                shopId: data.shopId,
                page: i
              })
            );
          }
          Promise.map(
            promises,
            function(promise) {
              trans.push(...promise.data.results);
            },
            { concurrency: 6 }
          ).then(() => {
            this.setPercentLoaded(100);
            this.trans = trans;
            console.log("finished Transactions");
            this.transLoaded = true;
            resolve();
          });
          // }
        });
      });
    },
    filterTransactions() {
      var to = new Date(this.dateTo);
      to = Math.floor(to.getTime() / 1000);
      var from = new Date(this.dateFrom);
      from = Math.floor(from.getTime() / 1000);
      var filteredTrans = [];
      for (var f = 0; f < this.trans.length; f++) {
        if (this.trans[f].paid_tsz < to && this.trans[f].paid_tsz > from) {
          filteredTrans.push(this.trans[f]);
        }
      }
      this.filteredTrans = filteredTrans;
    },
    filterReceipts() {
      console.log("filtering...");
      var filteredReceipts = [];
      var to = new Date(this.dateTo);
      to = Math.floor(to.getTime() / 1000);
      var from = new Date(this.dateFrom);
      from = Math.floor(from.getTime() / 1000);

      for (var f = 0; f < this.receipts.length; f++) {
        if (
          this.receipts[f].creation_tsz < to &&
          this.receipts[f].creation_tsz > from
        ) {
          filteredReceipts.push(this.receipts[f]);
        } else {
        }
      }

      filteredReceipts = filteredReceipts.filter(obj => {
        if (!this.viewing_all_receipts) {
          return obj.was_shipped === false;
        } else {
          return obj;
        }
      });

      this.filteredReceipts = filteredReceipts;
    },
    submit() {
      this.getSelf().then(() => {
        this.getShop().then(() => {
          this.getAllReceipts().then(() => {
            this.getAllTransactions().then(() => {
              this.filterReceipts();
              this.filterTransactions();
            });
          });
        });
      });
    },
    auth() {
      axios.get("/api/auth").then(res => {
        window.location = res.data;
      });
    },
    changeDateFrom(date) {
      var n = new Date(date);
      n.setHours(0, 0, 0, 0);
      this.setDateFrom(n);
      this.filterReceipts();
      this.filterTransactions();
      this.getSales();
      this.getQuantity();
    },
    changeDateTo(date) {
      var n = new Date(date);
      n.setHours(23, 59, 0, 0);
      this.setDateTo(n);
      this.filterReceipts();
      this.filterTransactions();
      this.getSales();
      this.getQuantity();
    },
    refresh() {
      this.submit();
    },
    addOdometer(val, index, theme) {
      var el = document.querySelector("#value" + index);
      this.bigTickerEl = el;
      var lowVal = Math.round(val / 2);

      var od = new Odometer({
        el: el,
        value: lowVal,
        format: "(d,ddd).d",
        theme,
        duration: 1000
      });

      el.innerHTML = Math.round(val * 10) / 10;
    },
    getQuantity() {
      var receipt_ids = this.filteredReceipts.map(a => {
        return a.receipt_id;
      });
      var newQuantity = 0;

      for (var i = 0; i < this.trans.length; i++) {
        if (receipt_ids.includes(this.trans[i].receipt_id)) {
          newQuantity += this.trans[i].quantity;
        }
      }

      this.setQuantity(newQuantity);

      for (var p = 0; p < receipt_ids.length; p++) {
        for (var k = 0; k < this.trans.length; k++) {
          if (this.trans[k].receipt_id == receipt_ids[p]) {
            this.filteredReceipts[p].quantity = this.trans[k].quantity;
            this.filteredReceipts[p].listing_id = this.trans[k].listing_id;
            this.filteredReceipts[p].adjusted_grandtotal = Number(
              this.filteredReceipts[p].adjusted_grandtotal
            );
          }
        }
      }
      this.allLoaded = true;

      setTimeout(() => {
        this.addOdometer(this.quantity, 0, "train-station");
        this.bigTickerEl.innerHTML = this.quantity;
      }, 100);
    },
    switchAll(data) {
      if (data == 0) {
        this.viewing_all_receipts = true;
      } else {
        this.viewing_all_receipts = false;
      }
      this.allLoaded = false;

      this.filterReceipts();
      this.filterTransactions();
      this.getSales();
      this.getQuantity();
      this.allLoaded = true;
    },

    getSales() {
      var count = 0;
      for (var i = 0; i < this.filteredTrans.length; i++) {
        count += this.filteredTrans[i].quantity;
        this.totalQuantity = count;
      }
    }
  },
  components: {
    Table,
    Datepicker,
    StandardSelect
  },
  computed: {
    totalSales() {
      var sales = 0;
      for (var i = 0; i < this.filteredReceipts.length; i++) {
        sales += Number(this.filteredReceipts[i].adjusted_grandtotal);
      }
      return Number(Math.round(sales).toFixed(0));
    },
    totalRevenue() {
      var revenue = 0;
      if (this.$store.state.userStore.userElement.listings != null) {
        for (var i = 0; i < this.filteredReceipts.length; i++) {
          var listings = this.$store.state.userStore.userElement.listings;
          var listing = listings.filter(list => {
            return list.listing_id === this.filteredReceipts[i].listing_id;
          });

          revenue +=
            Number(this.filteredReceipts[i].adjusted_grandtotal) -
            Number(listing[0].production_cost) *
              Number(this.filteredReceipts[i].quantity);
        }
        return Number(Math.round(revenue).toFixed(0));
      } else {
        return this.totalSales;
      }
    },
    dateFrom() {
      return this.$store.state.dateFrom;
    },
    dateTo() {
      return this.$store.state.dateTo;
    },
    quantity() {
      return this.$store.state.quantity;
    },
    shop() {
      return this.$store.state.shop;
    },
    percentLoaded() {
      return this.$store.state.percentLoaded;
    },
    token() {
      return this.$route.query.token;
    },
    secret() {
      return this.$route.query.secret;
    },
    user() {
      return this.$store.state.userStore.user;
    },
    highlighted() {
      if (this.dateTo == "") {
        return {
          from: this.dateFrom,
          to: this.dateFrom
        };
      }
      return {
        from: this.dateFrom,
        to: this.dateTo
      };
    },
    disabled() {
      return {
        from: new Date()
      };
    }
  },
  watch: {}
};
</script>
<style>
button {
  background: #47c3ad;
  border-radius: 100px;
  font-size: 12pt;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  padding: 15px 55px;
  cursor: pointer;
  border: none;
  outline: none !important;
}
button:hover {
  background: #38ad98;
}
.shop-title {
  font-size: 15pt;
  font-weight: bold;
  color: #fff;
  display: flex;
  align-items: center;
  background: transparent;

  padding: 15px;

  border-radius: 4px;
}
.shop-title img {
  border-radius: 100px;
  margin-right: 15px;
}
.receipt {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background: #f7fafb;
  border: solid 1px #eaeaea;
  border-radius: 3px;
}
.receipt-name {
  font-size: 12pt;
  font-weight: bold;
}
.receipt-amount {
  color: #fff;
  font-weight: bold;
  font-size: 15pt;
  margin-left: auto;
}
.total {
  font-size: 15pt;
  padding: 15px;
  text-align: right;
}
.pages {
  padding: 0px 15px;
  margin-top: 15px;
  display: flex;
  font-size: 10pt;

  align-items: center;
}

.pages ul {
  margin-left: auto;
  display: flex;
  font-size: 10pt;
}

.pages li {
  float: left;
  padding: 0px 10px;
  font-size: 10pt;
  color: #fff;
  font-weight: 500;
}

.pages li:hover {
  cursor: pointer;
  color: #fff;
}

.pages li.active {
  color: #fff;
  text-decoration: underline;
}
.drill-metrics-container {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  margin-top: 15px;
}
.drill-metric {
  flex: 1;
  flex-basis: 50%;
  padding: 25px 0px;
  background: #1b366d22;
  border: solid 1px #eaeaea33;
  border-right: none;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
}
.drill-metric:last-of-type {
  border-right: solid 1px #eaeaea33;
}
.drill-metric-title {
  color: #47c3ad;
  font-family: "Montserrat";
  font-weight: 500;
  font-size: 12pt;
}
.drill-metric-value {
  color: #fff;
  font-size: 20pt;
}
.big-ticker {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 155pt;
  line-height: 200px;
  margin-bottom: 20px;
  height: 236px;
}
.big-ticker-title {
  width: 100%;
  font-size: 20pt;
  text-align: center;
  color: #fff;
  margin-bottom: 20px;
}
@media (max-width: 750px) {
  .drill-metrics-container {
    flex-wrap: wrap;
  }
  .shop-details {
    font-size: 13pt;
  }
  .big-ticker {
    font-size: 80pt;
  }
}
.button-container {
  height: calc(100vh - 370px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.terms {
  width: 100%;
  padding: 15px;
  position: absolute;
  bottom: 15px;
  font-size: 8pt;
  text-align: center;
}
.ticker-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.refresh {
  margin-bottom: 50px;
  display: inline-flex;
}
.date-picker-title {
  position: absolute;
  font-size: 11pt;
  color: #657aaa;
  height: 43px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  padding: 15px;
}

.standard-input-item:hover .date-picker-title {
  color: #fff;
}
.date-picker-title.active {
  color: #fff;
  transform: scale(0.7, 0.7) translateY(-38px) translateX(-21px);
}
.standard-input-item.active .date-input {
  border-color: #47c3ad;
  box-shadow: 0px 0px 10px #47c3ad;
}
.standard-input-item {
  margin-right: 10px !important;
}
.global-options-container {
  height: 70px;
  padding: 0px 15px;
  padding-top: 12px;
  position: absolute;
  z-index: 10000000;
  margin-bottom: 15px;
  width: 100%;
  border-radius: 100px;
  display: flex;
  align-items: center;
}
.tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10000;
  margin-bottom: 15px;
}
.tab {
  max-width: 300px;
  width: 100%;
  padding: 5px 15px;
  font-size: 12pt;
  color: #fff;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
}
.tab:hover .tab-bar {
  transform: scaleX(1);
  background: #47c3ad43;
}
.tab-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  background: #47c3ad43;
  height: 2px;
  width: 100%;
  transform: scaleX(0);
  transform-origin: 50%;
  transition: all 0.3s ease;
}
.tab.active .tab-bar {
  background: #47c3ad;
  transform: scaleX(1);
}
@media (max-width: 728px) {
  .global-options-container {
    position: relative;
  }
  .vdp-datepicker__calendar {
    position: fixed !important;
    left: 0 !important;
    right: unset !important;
    top: 170px !important;
  }
}
</style>
