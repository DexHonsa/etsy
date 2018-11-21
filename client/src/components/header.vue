<template>
    <div class="top">
          <div v-if="Object.keys(shop).length != 0 && this.$route.path == '/connect'" class="loader-bar" :class="{
            'p10':percentLoaded == 10,
            'p20':percentLoaded == 20,
            'p30':percentLoaded == 30,
            'p40':percentLoaded == 40,
            'p80':percentLoaded == 80,
            'p90':percentLoaded == 90,
            'p100':percentLoaded == 100
            }"></div>
          <img style="height:45px; margin-right:10px;" src="../img/logo.png" alt=""> ShopButler &nbsp;
          <div v-if="Object.keys(shop).length != 0" @click="expandNav" class="nav-button">
              <transition
                    enter-active-class="fadeInLeft"
                    leave-active-class="fadeOutRight"
                    mode="out-in"
                  >
                <div :key="1" v-if="!nav" class="animated-fast">
                    <i  class="fal fa-bars "></i>
                </div>
                <div :key="2" v-if="nav" class="animated-fast">
                    <i  class="fal fa-angle-right "></i>
                </div>
                </transition>
              </div>
          <div v-if="Object.keys(shop).length != 0" class="nav-menu-container" :class="{'open':nav}">
              <transition
                enter-active-class="fadeIn"
                leave-active-class="fadeOut"
               >
                <div v-if="nav" class="overlay animated-fast"></div>
            </transition>
            <div class="nav-menu">
                <div class="nav-title">Menu</div>
                <ul>
                    <li @click="navigate('connect')" class="active">Home</li>
                    <li @click="navigate('listings')" class="active">Listings</li>
                    <li @click="logout" class="active">Logout</li>
                    <li @click="unlink">Unlink Etsy Account</li>
                    
                </ul>
            </div>
          </div>
          </div>
</template>
<script>
import auth from "../auth.js";
export default {
  name: "top",
  data() {
    return {
      nav: false
    };
  },
  componenets: {},
  mounted() {},
  methods: {
    unlink() {
      auth.unlinkAccount().then(() => {
        window.location.reload();
      });
    },
    logout() {
      auth.logout();
    },
    navigate(page) {
      this.nav = false;
      this.$router.push(
        page + "?token=" + this.token + "&secret=" + this.secret
      );
    },
    expandNav() {
      this.nav = !this.nav;
    }
  },
  computed: {
    percentLoaded() {
      return this.$store.state.percentLoaded;
    },
    shop() {
      return this.$store.state.shop;
    },
    token() {
      return this.$route.query.token;
    },
    secret() {
      return this.$route.query.secret;
    }
  }
};
</script>
<style>
.nav-button {
  position: fixed;
  z-index: 100000000;
  right: 15px;
  top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  height: 40px;
  width: 40px;
  font-size: 12pt;
  color: #fff;
  cursor: pointer;
}
.nav-menu {
  position: fixed;
  right: 0;
  top: 0px;
  background: #08305b;
  color: #fff;
  width: 250px;
  height: 100vh;
  z-index: 10000000;
  transform: translateX(100%);
  transition: all 0.3s ease;
}
.nav-menu-container.open .nav-menu {
  transform: translateX(0);
}
.nav-title {
  padding: 15px;
  border-bottom: solid 1px #fff;
  font-size: 13pt;
  font-weight: bold;
  height: 70px;
  display: flex;
  align-items: center;
}
.nav-menu ul li {
  padding: 15px;
  font-size: 12pt;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.nav-menu-container {
  background: transparent;
}

.overlay {
  background: #000000aa;
  height: 100vh;
  width: 100%;
  top: 0px;
  left: 0;
  z-index: 1000000;
  position: fixed;
}
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
</style>
