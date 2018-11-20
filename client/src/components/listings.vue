<template>
    <div class="container">
        <div v-if="Object.keys(images).length == activeListings.length || imagesLoaded" class="listing-items">
            <div  v-for="(list,i) in activeListings" :key="i" class="listing-item">
                <div class="listing-image" :style="'background-image:url('+images[list.listing_id]+')'"></div>
                
                <div class="listing-title truncated">{{list.title}}</div>
                <div class="listing-details">
                    <div class="listing-detail">
                        <div class="detail-title">Price</div>
                        <div class="detail-value">{{list.price}}</div>
                    </div>
                    <div class="listing-detail">
                        <div class="detail-title">Cost to Make</div>
                        <div class="detail-value">
                            <StandardInput
                               width="100px"
                               name="cost"
                               
                            />
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import Promise from "bluebird";
import { mapActions } from "vuex";
import StandardInput from "./form_elements/standard_input";
export default {
  name: "listings",
  data() {
    return {
      images: [],
      imagesLoaded: false
    };
  },
  components: {
    StandardInput
  },
  mounted() {
    if (this.activeListings.length <= 0) {
      this.getActiveListings().then(() => {
        this.getListingImages().then(() => {
          this.imagesLoaded = true;
        });
      });
    } else {
      this.getListingImages().then(() => {
        setTimeout(() => {
          this.imagesLoaded = true;
        }, 100);
      });
    }
  },
  methods: {
    ...mapActions(["setActiveListings"]),
    truncate(string) {
      if (string.length > 5) return string.substring(0, 5) + "...";
      else return string;
    },
    getListingImages() {
      return new Promise(resolve => {
        var listingImages = {};
        for (var i = 0; i < this.activeListings.length; i++) {
          var data = {
            token: this.token,
            secret: this.secret,
            listingId: this.activeListings[i].listing_id
          };
          axios.post("/api/get_listing_images", data).then(res => {
            listingImages[res.data.results[0].listing_id] =
              res.data.results[0].url_fullxfull;
          });
        }
        this.images = listingImages;
        resolve();
      });
    },
    getActiveListings() {
      var data = {
        token: this.token,
        secret: this.secret,
        shopId: this.shop.shop_id,
        page: 1
      };
      return new Promise((resolve, reject) => {
        axios.post("/api/get_active_listings", data).then(res => {
          var listings = res.data.results;
          if (res.data.count > 100) {
            var promises = [];
            var pages = Math.ceil(res.data.count / 100);
            for (var i = 2; i <= pages; i++) {
              data.page = i;
              promises.push(
                axios.post("/api/get_active_listings", {
                  token: data.token,
                  secret: data.secret,
                  shopId: data.shopId,
                  page: i
                })
              );
            }
            Promise.map(
              promises,
              promise => {
                listings.push(...promise.data.results);
              },
              { concurrency: Infinity }
            ).then(() => {
              this.setActiveListings(listings);
              console.log("finished listings");
              this.receiptsLoaded = true;
              resolve();
            });
          } else {
            this.setActiveListings(listings);
            console.log("finished listings");
            resolve();
          }
        });
      });
    }
  },
  computed: {
    shop() {
      return this.$store.state.shop;
    },
    token() {
      return this.$route.query.token;
    },
    secret() {
      return this.$route.query.secret;
    },
    activeListings() {
      return this.$store.state.activeListings;
    }
  }
};
</script>

<style>
.listing-items {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.listing-item {
  margin: 5px;
  background: #000;
  border-radius: 5px;
  flex-basis: calc(50% - 30px);
  flex: 1;
  max-width: 100%;
  min-width: 300px;
  flex-grow: unset;
  border: solid 1px #47c3ad;
  overflow: hidden;
}
.listing-image {
  background-size: cover;
  background-position: center, center;
  height: 200px;
  width: 100%;
}
.listing-title {
  font-size: 12pt;
  color: #fff;
  padding: 15px;
  padding-bottom: 0;
}
.truncated {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.listing-details {
  padding: 15px;
}
.detail-title {
  font-weight: bold;
}
.detail-value {
  margin-left: auto;
}
.listing-detail {
  display: flex;
  align-items: center;
}
@media (max-width: 728px) {
  .listing-item {
    margin: 5px;
    background: #000;
    border-radius: 5px;
    flex-basis: calc(100% - 30px);
    flex: 1;
    min-width: 50%;
    width: 100%;
    max-width: 100%;
  }
}
</style>

