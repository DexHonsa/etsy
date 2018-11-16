<template>
    <div style="position:relative; min-height:100vh">
        <div class="top">
          <div class="loader-bar" :class="{
            'p10':percentLoaded == 10,
            'p20':percentLoaded == 20,
            'p30':percentLoaded == 30,
            'p40':percentLoaded == 40,
            'p80':percentLoaded == 80,
            'p90':percentLoaded == 90,
            'p100':percentLoaded == 100
            }"></div>
          <img style="height:45px; margin-right:10px;" src="../img/logo.png" alt=""> ShopButler &nbsp; {{message}}</div>
        <div  class="content container">
          <div class="global-options-container" style="z-index:100000;">
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
              
              <div class="big-ticker">
                <img class="spin" v-if="!allLoaded" src="../img/spinner.svg" alt="">
                <div v-if="allLoaded" id="value0"></div>
              </div>
              <div class="big-ticker-title">Total Quantity Not Shipped</div><br>
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
                    <div v-if="allLoaded" id="value1"></div>
                    <img class="spin" v-if="!allLoaded" src="../img/spinner.svg" alt="">
                    </div>
                </div>
                <div class="drill-metric">
                  <div class="drill-metric-title">Orders Not Shipped</div>
                  <div class="drill-metric-value">
                    <div v-if="allLoaded" id="value2"></div>
                    <img class="spin" v-if="!allLoaded" src="../img/spinner.svg" alt="">
                    </div>
                  
                </div>
                <div class="drill-metric">
                  <div class="drill-metric-title">Total Quantity</div>
                  <div class="drill-metric-value">
                    <div v-if="allLoaded" id="value3"></div>
                    <img class="spin" v-if="!allLoaded" src="../img/spinner.svg" alt="">
                    </div>
                  
                </div>
                <div class="drill-metric">
                  <div class="drill-metric-title">Total Quantity Not Shipped</div>
                  <div class="drill-metric-value">
                    <div v-if="allLoaded" id="value4"></div>
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
          To Get Started, Link your Etsy Account to get sales information about your account.
          </div>
          <button v-if="Object.keys(shop).length == 0" @click="submit"><i style="margin-right:10px;" class="fal fa-link"></i>  Link Etsy Account</button>
        </div>
        </transition>
        <div class="terms">The term 'Etsy' is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy.</div>
       
    </div>
</template>
<script>
import Table from "./sales_table";
import axios from "axios";
import Promise from "bluebird";
import Datepicker from "vuejs-datepicker";
import VueOdometer from "v-odometer/src";
import moment from "moment";
export default {
  name: "login",
  data() {
    return {
      dateFrom: (() => moment().subtract(30, "days")._d)(),
      dateTo: (() => moment()._d)(),
      allLoaded: false,
      message: "",
      user: {},
      shop: {},
      receipts: [],
      trans: [],
      filteredReceipts: [],
      filteredTrans: [],
      total: 0,
      totalQuantity: 0,
      receiptsLoaded: false,
      transLoaded: false,
      quantityNotShippedLoaded: false,
      quantityNotShipped: 0,
      percentLoaded: 0,
      filteredReceipts: [],
      filteredTrans: []
    };
  },
  methods: {
    changeDateFrom(date) {
      var n = new Date(date);
      n.setHours(0, 0, 0, 0);
      this.dateFrom = n;
      this.submit();
    },
    changeDateTo(date) {
      var n = new Date(date);
      n.setHours(23, 59, 0, 0);
      this.dateTo = n;
      this.submit();
    },
    refresh() {
      this.submit();
    },
    addOdometer(val, index, theme) {
      var el = document.querySelector("#value" + index);
      var lowVal = Math.round(val / 2);
      console.log(lowVal);
      var od = new Odometer({
        el: el,
        value: lowVal,
        format: "(d,ddd).d",
        theme,
        duration: 1000
        //animation: "count"
      });

      el.innerHTML = Math.round(val * 10) / 10;
    },
    getOutstandingQuantity() {
      var that = this;
      var notShipped = this.filteredReceipts.map(a => {
        return a.receipt_id;
      });
      var newQuantity = 0;

      for (var i = 0; i < this.trans.length; i++) {
        if (notShipped.includes(this.trans[i].receipt_id)) {
          newQuantity += this.trans[i].quantity;
        }
      }
      this.quantityNotShipped = newQuantity;
      this.quantityNotShippedLoaded = true;

      for (var p = 0; p < notShipped.length; p++) {
        for (var k = 0; k < this.trans.length; k++) {
          if (this.trans[k].receipt_id == notShipped[p]) {
            this.filteredReceipts[p].quantity = this.trans[k].quantity;
            this.filteredReceipts[p].adjusted_grandtotal = Number(
              this.filteredReceipts[p].adjusted_grandtotal
            );
          }
        }
      }
      that.allLoaded = true;
      setTimeout(function() {
        that.addOdometer(that.quantityNotShipped, 0, "train-station");
        that.addOdometer(that.filteredTrans.length, 1, "minimal");
        that.addOdometer(that.filteredReceipts.length, 2, "minimal");
        that.addOdometer(that.totalQuantity, 3, "minimal");
        that.addOdometer(that.quantityNotShipped, 4, "minimal");
      }, 100);

      //vendors.filter(vendor => (vendor.Name === "Magenic"));

      // console.log(newQuantity);
    },
    scheduleRequests(axiosInstance, intervalMs) {
      let lastInvocationTime = undefined;

      const scheduler = config => {
        const now = Date.now();
        if (lastInvocationTime) {
          lastInvocationTime += intervalMs;
          const waitPeriodForThisRequest = lastInvocationTime - now;
          if (waitPeriodForThisRequest > 0) {
            return new Promise(resolve => {
              setTimeout(() => resolve(config), waitPeriodForThisRequest);
            });
          }
        }

        lastInvocationTime = now;
        return config;
      };

      axiosInstance.interceptors.request.use(scheduler);
    },
    submit() {
      this.allLoaded = false;
      this.receiptsLoaded = false;
      this.transLoaded = false;
      this.percentLoaded = 0;

      var that = this;
      setTimeout(function() {
        that.percentLoaded = 10;
      }, 1000);
      if (this.$route.query.token != null) {
        var token = this.$route.query.token;
        var secret = this.$route.query.secret;
        var data = {
          token,
          secret
        };
        axios.post("/api/get_self", data).then(res => {
          this.user = res.data.results[0];
          var data2 = {
            token,
            secret,
            userId: res.data.results[0].user_id
          };
          // console.log(res.data.results[0].user_id);

          axios.post("/api/get_shops", data2).then(res2 => {
            this.shop = res2.data.results[0];
            var data3 = {
              token,
              secret,
              shopId: res2.data.results[0].shop_id,
              page: 1
            };

            //-------------RECEIPTS------------------------//
            axios.post("/api/get_receipts", data3).then(res3 => {
              var receipts = res3.data.results;
              if (res3.data.count > 100) {
                var promises = [];
                var pages = Math.ceil(res3.data.count / 100);
                var data4 = JSON.parse(JSON.stringify(data3));
                for (var i = 2; i <= pages; i++) {
                  data4.page = i;
                  promises.push(
                    axios.post("/api/get_receipts", {
                      token: data4.token,
                      secret: data4.secret,
                      shopId: data4.shopId,
                      page: i
                    })
                  );
                }
                Promise.map(
                  promises,
                  function(promise) {
                    that.percentLoaded = 30;
                    receipts.push(...promise.data.results);
                  },
                  { concurrency: 3 }
                ).then(function() {
                  that.receipts = receipts;
                  var filteredReceipts = [];
                  var to = new Date(that.dateTo);
                  to = Math.floor(to.getTime() / 1000);
                  var from = new Date(that.dateFrom);
                  from = Math.floor(from.getTime() / 1000);

                  for (var f = 0; f < receipts.length; f++) {
                    if (
                      receipts[f].creation_tsz < to &&
                      receipts[f].creation_tsz > from
                    ) {
                      filteredReceipts.push(receipts[f]);
                    } else {
                      console.log(to);
                      console.log(from);
                      console.log(receipts[f].creation_tsz);
                      console.log("-----");
                    }
                  }
                  that.filteredReceipts = filteredReceipts;

                  that.percentLoaded = 90;
                  console.log("finished receipts");
                  that.receiptsLoaded = true;
                  //-------------TRANSACTIONS------------------------//
                  axios.post("/api/get_trans", data3).then(res3 => {
                    var trans = res3.data.results;
                    if (res3.data.count > 100) {
                      var promises = [];
                      var pages = Math.ceil(res3.data.count / 100);
                      var data4 = JSON.parse(JSON.stringify(data3));
                      for (var i = 2; i <= pages; i++) {
                        data4.page = i;
                        promises.push(
                          axios.post("/api/get_trans", {
                            token: data4.token,
                            secret: data4.secret,
                            shopId: data4.shopId,
                            page: i
                          })
                        );
                      }
                      Promise.map(
                        promises,
                        function(promise) {
                          trans.push(...promise.data.results);
                        },
                        { concurrency: 3 }
                      ).then(function() {
                        that.percentLoaded = 100;
                        that.trans = trans;

                        //filter transactions by date
                        var to = new Date(that.dateTo);
                        to = Math.floor(to.getTime() / 1000);
                        var from = new Date(that.dateFrom);
                        from = Math.floor(from.getTime() / 1000);
                        var filteredTrans = [];
                        for (var f = 0; f < trans.length; f++) {
                          if (
                            trans[f].paid_tsz < to &&
                            trans[f].paid_tsz > from
                          ) {
                            filteredTrans.push(trans[f]);
                          }
                        }
                        that.filteredTrans = filteredTrans;

                        console.log("finished Transactions");
                        that.transLoaded = true;
                        that.getSales();
                        that.getOutstandingQuantity();
                      });
                    }

                    // this.getTotals(receipts);
                    // this.getSales(receipts);
                  });
                  //that.getSales();
                });
              }
              // this.receipts = receipts;

              // this.getTotals(receipts);
              // this.getSales(receipts);
            });
          });
        });
      }
    },
    getSales() {
      var count = 0;
      for (var i = 0; i < this.filteredTrans.length; i++) {
        count += this.filteredTrans[i].quantity;
        this.totalQuantity = count;
      }
    },
    getTotals(results) {
      var that = this;
      var totals = 0.0;
      const promises = [];

      for (var i = 0; i < results.length; i++) {
        totals += Number(results[i].adjusted_grandtotal);
        var token = this.$route.query.token;
        var secret = this.$route.query.secret;
        var data = {
          token,
          secret,
          receiptId: results[i].receipt_id
        };

        promises.push(axios.post("/api/get_transaction", data));
      }
      setTimeout(function() {}, 200);

      Promise.map(
        promises,
        function(promise) {
          var total = 0;
          for (var i = 0; i < promise.data.results.length; i++) {
            total += promise.data.results[i].quantity;
          }
          that.totalQuantity += total;
        },
        { concurrency: 3 }
      ).then(function() {
        console.log("done");
      });

      this.total = Math.round(totals);
    }
  },
  components: {
    Table,
    Datepicker
  },
  mounted() {
    this.submit();
  },
  computed: {
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
.spin {
  height: 30px;
  margin-left: 15px;
}
.loader-bar {
  background: #47c3ad;
  height: 5px;
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.3s ease;
  width: 0%;
}
.p10 {
  width: 10%;
}
.p20 {
  width: 20%;
}
.p30 {
  width: 30%;
}
.p40 {
  width: 40%;
}
.p80 {
  width: 80%;
}
.p90 {
  width: 90%;
}
.p100 {
  width: 100%;
}

.top {
  font-size: 20pt;
  font-weight: lighter;
  position: relative;
  color: #fff;
  background: #00000033;
  padding: 15px;
  height: 70px;
  display: flex;
  align-items: center;
}
.content {
  padding: 15px;
  font-size: 12pt;
  position: relative;
  color: #fff;
}
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
</style>
