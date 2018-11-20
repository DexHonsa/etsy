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
                  
                  <input autocomplete="off" v-model="email" type="text">
                  <div class="input-label" :class="{'active': email.length > 0}">Email</div>
                  <div class="main-login-input-icon">
                    <i :class="{'active':email.length > 0}" class="fal fa-user-circle"></i>
                  </div>
                  <div class="input-bottom-bar"></div>
                </div>

                <div class="main-login-input-item">
                  <input autocomplete="new-password" v-model="password" type="password">
                  <div class="input-label" :class="{'active': password.length > 0}">Password</div>
                  <div class="main-login-input-icon">
                    <i :class="{'active':password.length > 0}" class="fal fa-lock"></i>
                  </div>
                  <div class="input-bottom-bar"></div>
                </div>
                <button type="submit" class="login-btn" :class="{'active':email.length > 0 && password.length > 0}">
                  <transition
                    enter-active-class="fadeIn"
                    leave-active-class="fadeOut"
                    mode="out-in"
                  >
                  <span class="animated-fast" v-if="!isLoading">Login</span>
                  
                  <img class="animated-fast" v-if="isLoading" style="width:40px;" src="../img/loader_h.svg" alt="">
                  </transition>
                </button>
                <transition
                    enter-active-class="fadeIn"
                    leave-active-class="fadeOut"
                  >
                <div class="login-error-box animated-med" v-if="hasError">
                  <i class="fal fa-exclamation-triangle"></i> Your login credentials did not work please try again.
                </div>
                </transition>
                </form>
                <div style="font-size:9pt; margin-top:15px; text-align:center;">New to Shop Butler? <span style="text-decoration:underline;cursor:pointer" @click="$router.push('/signup')">Create Account</span></div>
                <!-- <div class="tos">Terms of Service</div> -->
              </div>
               
               <div class="bottom-border-bar"></div>
           </div>
        </div>
    </div>
</template>
<script>
import auth from "../auth.js";
export default {
  name: "login",
  data() {
    return {
      email: "",
      password: "",
      isLoading: false,
      hasError: false
    };
  },
  mounted() {},
  methods: {
    onSubmit() {
      this.hasError = false;
      this.isLoading = true;

      auth.login({ email: this.email, password: this.password }).then(
        res => {
          console.log(res);
          this.$router.push("/connect");
        },
        () => {
          this.isLoading = false;
          this.hasError = true;
        }
      );
    }
  },
  computed: {},
  watch: {},
  components: {}
};
</script>
<style>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-animation: autofill 0s forwards;
  animation: autofill 0s forwards;
}

@keyframes autofill {
  100% {
    background: transparent;
    color: inherit;
  }
}

@-webkit-keyframes autofill {
  100% {
    background: transparent;
    color: inherit;
  }
}
.tos {
  font-size: 8pt;
  text-align: center;
  color: #657aaa;
  transition: all 0.3s ease;
  margin-top: 15px;
  user-select: none;
  position: absolute;
  left: 50%;
  bottom: 15px;
  transform: translateX(-50%);
}
.tos:hover {
  color: #fff;
  cursor: pointer;
}
.input-label {
  font-size: 11pt;
  position: absolute;
  height: 45px;
  display: flex;
  padding-left: 55px;
  transition: all 0.3s ease;
  color: #fff;
  pointer-events: none;
  align-items: center;
}
.login-container {
  background: linear-gradient(90deg, #1b366d, #26427d);
  border-radius: 5px;
  overflow: auto;
  height: 500px;
  max-width: 400px;

  width: 100%;
  position: relative;
  box-shadow: 5px 34px 54px -21px rgba(0, 0, 0, 0.3);
}
.main-login {
  /* background-image: url("../../img/bg2.jpg"); */
  background-size: cover;
  background-position: center center;
  height: calc(100vh - 70px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 600px;
}
.bottom-border-bar {
  background: #47c3ad;
  box-shadow: 0px 0px 26px 1px #47c3ad;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
}
.main-login-input-item {
  background: transparent;
  height: 45px;
  display: flex;
  margin-bottom: 15px;
  position: relative;
}
.main-login-input-item input {
  flex: 1;
  background: transparent;
  border: none;
  height: 100%;
  width: 100%;
  padding: 10px;
  outline: none;
  margin-left: 45px;
  color: #fff;
}
.input-bottom-bar {
  position: absolute;
  height: 2px;
  background: #47c3ad;
  transform-origin: 50%;
  box-shadow: 0px 0px 26px 1px #47c3ad;
  transform: scaleX(0);
  transition: all 0.2s ease;
  border-radius: 100px;
  width: 100%;
  bottom: 0;
}
.main-login-input-item input:focus ~ .input-bottom-bar {
  transform: scaleX(1);
}
.input-label.active {
  color: #697eac;
  transform: scale(0.7) translateX(-2px) translateY(-30px);
}

.main-login-input-icon {
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  width: 45px;
  position: absolute;
  left: 0;
}
.main-login-input-item input:focus ~ .main-login-input-icon i {
  color: #fff !important;
}
.main-login-input-icon i.active {
  color: #fff !important;
}
.main-login-input-icon i {
  font-size: 15pt;
  transition: all 0.5s ease;
  color: #697eac;
}
.main-logo-container {
  display: flex;
  flex-direction: column;
  font-family: "Gotham";
  font-weight: 300;
  font-size: 17pt;
  line-height: 14pt;
  align-items: center;
  justify-content: center;
  padding: 35px 0px;
}
.main-input-items {
  margin: 0px 35px;
}
.login-btn {
  color: #657aaa !important;
  border-color: #657aaa !important;
  user-select: none;
  pointer-events: none;
  background: transparent !important;
}
.login-btn.active {
  pointer-events: all;
  background: #47c3ad !important;
  border-color: #47c3ad !important;
  color: #fff !important;
  box-shadow: 1px 1px 10px #47c3ad;
}
.login-error-box {
  padding: 15px 0px;
  font-size: 11pt;
  padding-bottom: 0px;
  text-align: center;
}
.login-btn:hover {
  background: #47c3ad;
  cursor: pointer;
}

.login-btn:active {
  transform: scale(0.98, 0.98);
  background: #47c3ad;
}

.sign-up-container {
  padding: 15px;
  display: inline-block;
  bottom: 0;
  width: 100%;
  left: 0;
  font-size: 12pt;
}

.login-btn.loading {
  transition: all 0.2s ease;
  width: 45px;
  border-radius: 100px;
}

.login-btn {
  display: inline-flex;
  padding: 0;
  align-items: center;
  justify-content: center;
  background: transparent;
  height: 45px;
  border: solid 1px #47c3ad;
  transition: all 0.1s ease;
  color: #fff;
  margin-top: 15px;
  width: 100%;
  border-radius: 100px;
}
@media (max-width: 728px) {
  .login-container {
    background: transparent;
    box-shadow: none;
  }
  .bottom-border-bar {
    display: none;
  }
}
</style>

