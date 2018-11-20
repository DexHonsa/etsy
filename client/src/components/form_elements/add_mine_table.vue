<template lang="html">
  <table class="standard-input-table">
    <tbody>
      <tr>
        <th v-for="(header,i) in headers" v-bind:key="i">{{header}}</th>
      </tr>

      <tr v-for="(block,i) in blockRows"  v-bind:key="i">
        <td v-for="(inputName,i2) in inputNames" v-bind:key="i2"><input :id="inputName" :name=" 'type' + '$' + 'i'+ '$' + 'block'" class="standard-input" type="text" /></td>

      </tr>
      <tr>
        <td v-on:click="addBlockRow" id="add-new-row-btn" class="add-new-row-btn" colSpan="100"><i class="fa fa-plus" /></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "add_mine_table",
  props: ["headers", "inputNames", "type"],
  data() {
    return {
      blockRows: []
    };
  },
  methods: {
    addBlockRow: function() {
      var arr = this.blockRows;
      arr.push({ column: 5 });
      this.blockRows = arr;
    }
  }
};
</script>
