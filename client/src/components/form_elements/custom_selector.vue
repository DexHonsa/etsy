<template>
<div>
  <div class="standard-input-title">{{field}}</div>
    <div  @click="toggleSelector" :style="{maxWidth:width}" class="custom-selector-container"  :class="{'open':selectorOpen,'input': true, 'is-danger': errors.has(name)}">
      
        <input style="display:none" :autocomplete="name" data-vv-validate-on="none" ref='select' v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(name) }" :name="name" class="standard-input" />
        <div class="inner-selector">
            <div class="selector-label">{{selectedOption.label}}</div>
            <i class="fa fa-angle-down"></i>
        </div>
        
        <div v-click-outside="toggleSelector" v-if="selectorOpen" class="selector-options animated-fast fadeIn">
            <ul>
                <li v-for="(option, i) in options" :key="i" @click="selectOption(option)" :class="{'selector-option active':(selectedOption.label == option.label),'selector-option':(selectedOption.label != option.label)}">{{option.label}} </li>
            </ul>
        </div>
    </div>
    <span v-show="errors.has(name)" class="help is-danger">{{ errors.first(name) }}</span>
    </div>
</template>
<script>
export default {
  name: "custom-selector",
  props: ["name", "field", "options", "width", "required"],
  inject: ["$validator"],
  data() {
    return {
      selectorOpen: false,

      selectedOption: {}
    };
  },
  methods: {
    toggleSelector() {
      this.selectorOpen = !this.selectorOpen;
    },
    selectOption(option) {
      this.selectedOption = option;

      if (this.$refs.select.value == option.value) {
      } else {
        this.$refs.select.value = option.value;
      }
    }
  },
  mounted() {
    //var selector = this.$refs.select;
    // var opt = this.options;
    // var createOptions = function() {
    //   var allOptions = [];
    //   opt.forEach(function(item) {
    //     allOptions.push(`<option>` + item.label + `</option>`);
    //   });
    //   return allOptions.join();
    // };
    //this.labelOptions = createOptions();
  }
};
</script>
<style>
</style>
