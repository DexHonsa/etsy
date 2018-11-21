<template>
<div class='standard-input-item' :style="'max-width:'+width">
  <div>
    <div class="standard-input-title">{{field}}</div>
      
      <input @blur="inputBlur" @input="inputChange" :autocomplete="name" data-vv-value-path="dValue" :data-vv-as="field" v-validate="isRequired" v-model="inputValue" :placeholder="placeholder" ref="input" :class="[{'input': true, 'is-danger': errors.has(name)}, activeClass]" :id="id" :type="type" :name="name" class="standard-input" />
      <span v-show="errors.has(name)" class="help is-danger">{{ errors.first(name) }}</span>
    
  </div>
</div>
</template>
<script>
export default {
  name: "",
  data: () => ({
    isRequired: "",
    inputValue: "",
    confirm: false
  }),
  inject: ["$validator"],
  props: [
    "type",
    "width",
    "name",
    "field",
    "required",
    "activeClass",
    "placeholder",
    "value",
    "id",
    "passwordConfirm",
    "password",
    "onChange",
    "onBlur",
    "data"
  ],
  mounted() {
    this.inputValue = this.value;
    if (this.required) {
      this.isRequired = "required";
    }
    if (this.passwordConfirm) {
      this.isRequired = "required|confirmed:" + this.password;
    }
  },
  watch: {
    password(val) {
      this.isRequired = "required|confirmed:" + val;
    }
  },
  methods: {
    inputChange() {
      if (this.onChange) {
        this.onChange(this.$refs.input.value);
      }
    },
    inputBlur() {
      if (this.data !== null) {
        var formatted = Number(this.inputValue).toFixed(2);
        this.inputValue = formatted;
        this.onBlur(this.data, this.inputValue);
      }
    }
  }
};
</script>
