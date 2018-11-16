<template>
<div style="display:flex; align-items:center; justify-content:center; min-height:200px">
    <div v-if="!isLoaded"  style="background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; height:40px; width:40px; border-radius:5px;">
    <img style="width:20px;" src="../img/spinner.svg" alt="">
    </div>
<div v-if="isLoaded" style=" width:100%;">
    <div class="table-title">Non-Shipped Sales</div>
    <div  class="drill-metric-table-wrapper">
        <div class="header-bg"></div>
                <div class="drill-table">

                <table class="drill-metric-table">
                <tr>
                  <th @click="sortBy('name')"  ><span class="header"> Name<i v-if="sortKey == 'name'" v-bind:class="{'fa fa-caret-down':!reverse,'fa fa-caret-up': reverse }"></i></span></th>
                  <th @click="sortBy('quantity')" ><span class="header"> Quantity <i v-if="sortKey == 'quantity'" v-bind:class="{'fa fa-caret-down':!reverse,'fa fa-caret-up': reverse }"></i></span></th>
                  <th @click="sortBy('adjusted_grandtotal')" ><span class="header"> Amount <i v-if="sortKey == 'adjusted_grandtotal'" v-bind:class="{'fa fa-caret-down':!reverse,'fa fa-caret-up': reverse }"></i></span></th>
                </tr>
                <tr v-for="(row, i) in orderedItems" :key="i">
                <td>{{row.name}}</td>
                <td>{{row.quantity}}</td>
                <td>$ {{Number(row.adjusted_grandtotal).toFixed(2)}}</td>
                  
                </tr>
               
              </table>
              
              </div>
              
              </div>
              <div class="pages" v-if="receipts.length > 100">
            Viewing {{orderedItems.length}} of {{receipts.length}}
                <ul>
                  <li v-for="(page,i) in pageNumbers" :key="i" v-bind:class="{'active':checkActivePage(page)}" @click="activatePage(page)">{{page}}</li>
                </ul>
              </div>
</div>
</div>
</template>
<script>
import _ from "lodash";
export default {
  props: ["receipts"],
  data() {
    return {
      isLoaded: true,
      headers: [],
      count: "",
      sortKey: "name",
      reverse: false,
      blank: false,
      pageNumbers: [],
      pageActive: 1
    };
  },
  methods: {
    checkActivePage(page) {
      if (page === this.pageActive) {
        return true;
      } else {
        return false;
      }
    },
    orderItems() {
      this.pageNumbers = [];
      var activePage = this.pageActive;
      var numberPerPage = 100;

      var ordered = _.sortBy(this.receipts, this.sortKey);
      if (this.reverse) {
        ordered = ordered.reverse();
      } else {
      }

      var numberOfPages = Math.ceil(ordered.length / numberPerPage);
      for (var i2 = 1, len2 = numberOfPages; i2 <= len2; i2++) {
        var number = i2;
        this.pageNumbers.push(number);
      }

      var pageToShow = [];
      this.count = ordered.length;
      for (var i = 0, len = ordered.length; i < len; i++) {
        var itemsToShow = activePage * numberPerPage;
        var startingPoint = itemsToShow - numberPerPage;
        if (startingPoint <= i && i < itemsToShow) {
          pageToShow.push(ordered[i]);
        }
      }
      return pageToShow;
    },
    activatePage(page) {
      this.pageActive = page;
    },
    sortBy: function(field) {
      this.sortKey = field;
      if (this.sortKey === field) {
        this.reverse = !this.reverse;
      } else {
        this.reverse = false;
      }
    }
  },
  computed: {
    orderedItems: function() {
      return this.orderItems();
    }
  },
  mounted() {}
};
</script>
<style>
.header-bg {
  position: absolute;
  background: transparent;
  border-bottom: solid 1px #e2eaec;

  height: 31px;
  width: 100%;
}
.drill-metrics-container {
  display: flex;
  align-items: center;
  margin-top: 15px;
}
.drill-metric {
  flex: 1;
  padding: 25px 0px;
  background: #1b366d22;
  border: solid 1px #eaeaea33;
  border-right: none;
  text-align: center;
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
.drill-metric-table {
  width: 100%;
}
.drill-table {
  max-height: 320px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  margin-top: 30px;
}
.drill-metric-table-wrapper {
  position: relative;
  border: solid 1px #e2eaec;
  max-height: 350px;
  overflow-y: hidden;
  overflow-x: hidden;
}
.table-title {
  padding: 15px;
  font-size: 15pt;
  font-weight: bold;
  text-align: center;
}
.drill-metric-table th {
  padding: 0px;

  font-size: 6pt;
  color: #fff;
  text-transform: capitalize;
  font-weight: 400;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.drill-metric-table tr:first-of-type {
}
.drill-metric-table tr:hover td {
  background: #ffffff33;
}
.drill-metric-table td {
  text-align: center;
  width: 10%;
  padding: 3px 15px;
  border-left: solid 1px rgb(226, 234, 236);
  font-size: 10pt;
}
.drill-metric-table td:first-of-type {
  border-left: none;
}
.header {
  font-weight: 300;
  color: #fff;
  font-size: 8pt;
  font-weight: 400;
  position: absolute;
  padding: 5px;
  padding-top: 7px;
  width: 10%;
  top: 0px;
  z-index: 2;
  height: 30px;
  flex: 1;
  white-space: nowrap;
  user-select: none;
}
.header:hover {
  cursor: pointer;
  color: #fff;
}
</style>
