<template>
  <div :style="'width:'+width" style="margin:2px;">
      <div class="standard-input-title">{{field}}</div>
      <div v-click-outside="hideOpen" @click="toggleOpen" class="custom-select-container" :class="{'open':open,'input': true, 'is-danger': errors.has(name)}" :style="{width:width}">
        <input v-model="seachTerm" type="text" class="faux-input">
          <input :class="activeClass" :id="id" :value="selectedOption.value"  :name="name" ref="input" v-validate="isRequired" type="text" style="display:none" />
          
          <div v-if="seachTerm == ''" class="custom-select-field">{{selectedOption.label}}</div>
          <i class="fal fa-angle-down"></i>
          <div v-if="open" class="custom-select-options animated-fast">
              <ul>
                  <li v-for="(option, i) in filteredOptions" :key="i" @click="selectOption(option)">{{option.label}}</li>
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
      isRequired: "",
      seachTerm: ""
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
      this.seachTerm = "";
      this.selectedOption = option;
      var that = this;
      setTimeout(function() {
        that.$validator.validateAll();
        that.onChange(option);
      }, 1);
    },
    filterOptions() {}
  },
  computed: {
    filteredOptions() {
      var that = this;
      if (this.seachTerm == "") {
        return this.options;
      } else {
        return this.options.filter(function(name) {
          if (
            name.label.toLowerCase().match(that.seachTerm.toLowerCase()) != null
          ) {
            return name;
          }
        });
      }
    }
  },
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
