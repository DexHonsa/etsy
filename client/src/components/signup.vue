<template>
    <div>
        <div class="main-login" style="position:relative">
          <div style="width:100%; height:calc(100vh - 70px); position:absolute; top:0;">
          <vue-particles 
            color="#47c3ad"
            :particleOpacity="0.7"
            :particlesNumber="80"
            shapeType="circle"
            :particleSize="0"
            linesColor="#47c3ad"
            :linesWidth="1"
            :lineLinked="true"
            :lineOpacity="0.6"
            :linesDistance="150"
            :moveSpeed="1"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push"
          ></vue-particles>
          </div>
           <div class="login-container animated fadeIn">
             <div class="main-logo-container">
               <img style="width:100px;" src="../img/logo.png" alt=""><br>
               <span>Shop Butler<sup style="font-size:7pt;top:-1em;">TM</sup></span>
              </div>
              <div class="main-input-items">
                <form @submit.prevent="onSubmit">
                <div class="main-login-input-item">
                  
                  <input autocomplete="off" v-validate="'required|email'" name="email"  v-model="email" type="text">
                  <div class="input-label" :class="{'active': email.length > 0}">Email</div>
                  <div class="main-login-input-icon">
                    <i :class="{'active':email.length > 0}" class="fal fa-user-circle"></i>
                  </div>
                  
                  <div class="input-bottom-bar"></div>
                </div>
                <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>

                <div class="main-login-input-item">
                  <input v-validate="'required'" autocomplete="new-password" name="password" type="password" v-model="password" ref="password">
                  <div class="input-label" :class="{'active': password.length > 0}">Password</div>
                  <div class="main-login-input-icon">
                    <i :class="{'active':password.length > 0}" class="fal fa-lock"></i>
                  </div>
                  <div class="input-bottom-bar"></div>
                </div>
                <div class="main-login-input-item">
                  <input autocomplete="off" v-validate="'required|confirmed:password'" name="password_confirmation" v-model="password_r" type="password"  data-vv-as="password">
                  <!-- <input  v-model="password_r" type="password"> -->
                  <div class="input-label" :class="{'active': password_r.length > 0}">Re-type Password</div>
                  <div class="main-login-input-icon">
                    <i :class="{'active':password_r.length > 0}" class="fal fa-lock"></i>
                  </div>
                  <div class="input-bottom-bar"></div>
                </div>
                <span v-show="errors.has('password_confirmation')" class="help is-danger">{{ errors.first('password_confirmation') }}</span>
                <button type="submit" class="login-btn" :class="{'active':email.length > 0 && password.length > 0}">
                  <transition
                    enter-active-class="fadeIn"
                    leave-active-class="fadeOut"
                    mode="out-in"
                  >
                  <span class="animated-fast" v-if="!isLoading">Sign Up</span>
                  
                  <img class="animated-fast" v-if="isLoading" style="width:40px;" src="../img/loader_h.svg" alt="">
                  </transition>
                </button>
                <transition
                    enter-active-class="fadeIn"
                    leave-active-class="fadeOut"
                  >
                  <div v-if="hasError" class="login-error animated fadeIn" style="color:#ffa5a5; text-align:center; margin-top:15px; font-size:10pt">{{errorMessage}}</div>
                <!-- <div class="login-error-box animated-med" v-if="hasError">
                  <i class="fal fa-exclamation-triangle"></i> Your login credentials did not work please try again.
                </div> -->
                </transition>
                </form>
                <!-- <div class="tos">Terms of Service</div> -->
              </div>
               
               <div class="bottom-border-bar"></div>
           </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import auth from "../auth.js";
export default {
  name: "login",
  data() {
    return {
      email: "",
      password: "",
      password_r: "",
      isLoading: false,
      hasError: false,
      errorMessage: ""
    };
  },
  $_veeValidate: {
    validator: "new"
  },
  mounted() {},
  methods: {
    onSubmit() {
      this.isLoading = true;
      var form = event.target;
      var data = new FormData(form);
      data = data.entries();
      var obj = data.next();
      var retrieved = {};

      while (undefined !== obj.value) {
        retrieved[obj.value[0]] = obj.value[1];
        obj = data.next();
      }
      this.$validator.validateAll().then(result => {
        if (!result) {
          this.isLoading = false;
          return;
        }

        if (!this.errors.any()) {
          // console.log(retrieved);
          axios.post("/api/signup", retrieved).then(
            res => {
              auth
                .login({
                  email: retrieved.email,
                  password: retrieved.password
                })
                .then(() => {
                  this.$router.push("/connect");
                });
              // console.log(res.data);
            },
            err => {
              this.isLoading = false;
              //console.log(err.response);
              this.hasError = true;
              this.errorMessage = err.response.data.error;
            }
          );
        }
      });
    }
  },
  computed: {},
  watch: {},
  components: {}
};
</script>
<style>
.help {
  font-size: 9pt;
  text-align: center;
  position: relative;
  display: block;
  transform: translateY(-9px);
}
</style>

