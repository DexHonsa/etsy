<template>
  <div :style="'width:'+width" style="margin:2px;">
      <div class="standard-input-title">{{field}}</div>
      <div v-click-outside="hideOpen" @click="toggleOpen" class="custom-select-container" :class="{'open':open,'input': true, 'is-danger': errors.has(name)}" :style="{width:width}">
          <input :id="id" :value="selectedOption.value" :class="activeClass"  :name="name" ref="input" v-validate="isRequired" type="text" style="display:none" />
          
          <div  class="custom-select-field">{{selectedOption.label}}</div>
          <i class="fal fa-angle-down"></i>
          <div v-if="open" class="custom-select-options">
              <ul>
                  <li v-for="(option, i) in options" :key="i" @click="selectOption(option)">{{option.label}}</li>
              </ul>
          </div>
      </div>
      <span v-show="errors.has(name)" class="help is-danger">{{ errors.first(name) }}</span>
  </div>
</template>
<script>
export default {
  name: "custom_select",
  props: [
    "id",
    "field",
    "name",
    "width",
    "options",
    "value",
    "required",
    "onChange",
    "activeClass"
  ],
  inject: ["$validator"],
  data() {
    return {
      open: false,
      selectedOption: {},
      isRequired: ""
    };
  },
  methods: {
    toggleOpen() {
      this.open = !this.open;
    },
    hideOpen() {
      this.open = false;
    },
    selectOption(option) {
      this.selectedOption = option;

      var that = this;
      setTimeout(function() {
        that.$validator.validateAll();
        that.onChange(option);
      }, 1);
    }
  },
  computed: {},
  mounted() {
    if (this.value != null) {
      this.selectedOption = this.value;
    } else {
      this.selectedOption = "";
    }
    if (this.required) {
      this.isRequired = "required";
    }
  },
  watch: {
    // value(val) {
    //   if (val != this.selectedOption) {
    //     this.selectedOption = val;
    //   }
    // }
  }
};
</script>
<style>
</style>
