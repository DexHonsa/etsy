<template>
    <div>
        <div class="top">Etsy Store Helper &nbsp; {{message}}</div>
        <div  class="content container">
            
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
                <div id="value0"></div>
              </div>
              <div class="big-ticker-title">Total Quantity Not Shipped</div>
            </div>
            
            <div v-if="Object.keys(shop).length != 0" class="receipts">

              <div class="drill-metrics-container">
                <div class="drill-metric">
                  <div class="drill-metric-title">Total Orders</div>
                  <div class="drill-metric-value">
                    <div id="value1"></div>
                    <img class="spin" v-if="!allLoaded" src="../img/spinner.svg" alt="">
                    </div>
                </div>
                <div class="drill-metric">
                  <div class="drill-metric-title">Orders Not Shipped</div>
                  <div class="drill-metric-value">
                    <div id="value2"></div>
                    <img class="spin" v-if="!allLoaded" src="../img/spinner.svg" alt="">
                    </div>
                  
                </div>
                <div class="drill-metric">
                  <div class="drill-metric-title">Total Quantity</div>
                  <div class="drill-metric-value">
                    <div id="value3"></div>
                    <img class="spin" v-if="!allLoaded" src="../img/spinner.svg" alt="">
                    </div>
                  
                </div>
                <div class="drill-metric">
                  <div class="drill-metric-title">Total Quantity Not Shipped</div>
                  <div class="drill-metric-value">
                    <div id="value4"></div>
                    <img class="spin" v-if="!allLoaded" src="../img/spinner.svg" alt="">
                    </div>
                 
                </div>
                <!-- <div class="drill-metric">
                  <div class="drill-metric-title">Total Revenue</div>
                  <div class="drill-metric-value">
                    <div id="value5"></div>
                    </div>
                  
                </div> -->
                

              </div>
              <!-- <div class="total">Total Orders: <span v-if="transLoaded">{{trans.length}}</span> <img class="spin" v-if="!transLoaded" src="../img/spinner.svg" alt=""></div>
              <div class="total">Orders Not Shipped: <span v-if="receiptsLoaded">{{receipts.length}}</span> <img class="spin" v-if="!receiptsLoaded" src="../img/spinner.svg" alt=""></div>

              <div class="total">Total Quantity To Date: <span v-if="transLoaded">{{totalQuantity}}</span> <img class="spin" v-if="!transLoaded" src="../img/spinner.svg" alt=""></div>
              <div class="total">Total Quantity Not Shipped: <span v-if="quantityNotShippedLoaded">{{quantityNotShipped}}</span> <img class="spin" v-if="!quantityNotShippedLoaded" src="../img/spinner.svg" alt=""></div> -->
              <Table v-if="transLoaded" :receipts="receipts"/>
              <!-- <div class="receipt" v-for="(rec, i) in receipts" :key="i">

                <div class="receipt-name">{{rec.name}}</div>
                <div class="receipt-amount">$ {{rec.adjusted_grandtotal}}</div>
                
              </div> -->
            </div>
             
        </div>
        <div class="button-container">
          <div v-if="Object.keys(shop).length == 0" style="max-width:80%; width:100%; font-size:13pt; margin:15px; text-align:center;">
          To Get Started, Link your Etsy Account to get sales information about your account.
          </div>
          <button v-if="Object.keys(shop).length == 0" @click="submit"><i style="margin-right:10px;" class="fal fa-link"></i>  Link Etsy Account</button>
        </div>
       
    </div>
</template>
<script>
import Table from "./sales_table";
import axios from "axios";
import Promise from "bluebird";
import VueOdometer from "v-odometer/src";
export default {
  name: "login",
  data() {
    return {
      allLoaded: false,
      message: "",
      user: {},
      shop: {},
      receipts: [],
      trans: [],
      total: 0,
      totalQuantity: 0,
      receiptsLoaded: false,
      transLoaded: false,
      quantityNotShippedLoaded: false,
      quantityNotShipped: 0
    };
  },
  methods: {
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
      var notShipped = this.receipts.map(a => {
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
            this.receipts[p].quantity = this.trans[k].quantity;
            this.receipts[p].adjusted_grandtotal = Number(
              this.receipts[p].adjusted_grandtotal
            );
          }
        }
      }
      this.allLoaded = true;
      this.addOdometer(this.quantityNotShipped, 0, "train-station");
      this.addOdometer(this.trans.length, 1, "minimal");
      this.addOdometer(this.receipts.length, 2, "minimal");
      this.addOdometer(this.totalQuantity, 3, "minimal");
      this.addOdometer(this.quantityNotShipped, 4, "minimal");

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
      axios.get("/api/auth").then(res => {
        window.location = res.data;
      });
    },
    getSales() {
      var count = 0;
      for (var i = 0; i < this.trans.length; i++) {
        count += this.trans[i].quantity;
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

          // console.log(promise);
          // Promise.map awaits for returned promises as well.
          // return fs.readFileAsync(fileName);
        },
        { concurrency: 3 }
      ).then(function() {
        console.log("done");
      });

      // axios
      //   .all(promises)
      //   .then(
      //     axios.spread((...args) => {
      //       var totalQuantity = 0;
      //       for (let i = 0; i < args.length; i++) {
      //         if (args[i].data.results[0] == null) {
      //           continue;
      //         }
      //         totalQuantity += args[i].data.results[0].quantity;
      //         console.log(i);
      //         this.receipts[i].quantity = args[i].data.results[0].quantity;
      //       }
      //       this.totalQuantity = totalQuantity;
      //     })
      //   )
      //   .then(() => {
      //     console.log("test");
      //   });

      this.total = Math.round(totals);
    }
  },
  components: {
    Table
  },
  mounted() {
    var that = this;
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
              console.log(pages);
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
                  receipts.push(...promise.data.results);
                },
                { concurrency: 3 }
              ).then(function() {
                that.receipts = receipts;
                // that.isLoaded = true;
                console.log("finished receipts");
                that.receiptsLoaded = true;
                //-------------TRANSACTIONS------------------------//
                axios.post("/api/get_trans", data3).then(res3 => {
                  var trans = res3.data.results;
                  if (res3.data.count > 100) {
                    var promises = [];
                    var pages = Math.ceil(res3.data.count / 100);
                    console.log(pages);
                    var data4 = JSON.parse(JSON.stringify(data3));
                    for (var i = 2; i <= pages; i++) {
                      data4.page = i;
                      promises.push(
                        axios.post("/api/get_trans", {
                          token: data4.token,
                          secret: data4.secret,
                          shopId: data4.shopId,
                          //offset: i*100 - 100,
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
                      that.trans = trans;
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
            this.receipts = receipts;
            // this.getTotals(receipts);
            // this.getSales(receipts);
          });
        });
      });
    }
  },
  computed: {},
  watch: {}
};
</script>
<style>
.spin {
  height: 30px;
  margin-left: 15px;
}
.top {
  font-size: 20pt;
  font-weight: lighter;
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
}
.big-ticker-title {
  width: 100%;
  font-size: 20pt;
  text-align: center;
  color: #fff;
  margin-bottom: 50px;
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
</style>
