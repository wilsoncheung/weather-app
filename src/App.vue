<template>
  <div id="app">
    <div class="container d-flex h-100">
      <div class="row justify-content-center align-self-center">
        <!-- <div class="col-sm-12 my-auto"> -->
        <CurrentWeather
          v-if="weather.length != 0"
          v-bind:weather="weather"
          v-on:scaleClicked="changeScale = !changeScale"
          :loading="loading"
          class="col-12"
        />
        <SearchBar
          v-if="weather.length != 0"
          @updatedWeather="updateWeather"
          @isSearching="isSearching"
          class="col-12"
        />
        <Forecast
          v-if="weather.length != 0"
          :weather="weather"
          :changeScale="changeScale"
          :loading="loading"
          class="col-12"
        />
        <!-- </div> -->
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import CurrentWeather from "./components/CurrentWeather.vue";
import SearchBar from "./components/SearchBar.vue";
import Forecast from "./components/Forecast.vue";
import Footer from "./components/Footer.vue";
import $ from "jquery";
// import axios from 'axios'

export default {
  name: "app",
  components: {
    CurrentWeather,
    SearchBar,
    Forecast,
    Footer
  },
  data: () => ({
    geolocation: {
      latitude: 0,
      longitude: 0
      // reverseGeocode: []
    },
    weather: [],
    errors: [],
    changeScale: false,
    loading: false
  }),

  methods: {
    isSearching(boolVal) {
      this.loading = boolVal;
    },
    updateWeather(newWeatherUpdate) {
      this.weather = newWeatherUpdate;
      // console.log("Weather updated!!");
    },
    // reverseGeocoding(geo) {
    //       let self = this;

    //       axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + geo.latitude + ',' + geo.longitude + '&key=AIzaSyB4v4851zzgqR4vYwG3FZbEckU2yMavgJY')
    //           .then(resp => {
    //               self.geolocation.reverseGeocode = resp.data.results[0];
    //               self.weather.location = self.geolocation.reverseGeocode.formatted_address;
    //               console.log(resp);
    //           })
    //           .catch(e => {
    //               self.errors.push(e);
    //           });
    // },
    getWeatherOnCurrentPosition(coordinates) {
      //   **********  must use self = this **************
      // this reference vue-app.  must pass it to self, then pass into callback function (success call back)
      // have to update the view's data-items after you've received the data. Note, that ajax is asyncronous,
      // you'll only have data in the success callback function!
      var self = this;

      const URL =
        "https://api.darksky.net/forecast/4ef00c506da530ad9b922f03b286243d/" +
        coordinates.latitude +
        "," +
        coordinates.longitude;

      // Had to add v-if because AJAX call is asyncronous and data is not propogated to child components
      // until after it is created..
      $.ajax({
        url: URL,
        dataType: "jsonp",
        success: function(resp) {
          //Check that the returned objects contains data
          if (Object.keys(resp).length !== 0) {
            self.weather = resp; // if used this here, it would reference the this in this ajax call!!
            // self.reverseGeocoding(self.geolocation);
            self.loading = false;
          }
        },
        error: function(error) {
          self.errors.push(error);
          self.loading = false;
        }
      });
    },
    setPositions(position) {
      this.loading = true;
      this.geolocation.latitude = position.coords.latitude;
      this.geolocation.longitude = position.coords.longitude;
      this.getWeatherOnCurrentPosition(this.geolocation);
    }
  },

  // Great time to fire off api calls so it has some time to load
  // before the component is visible to user.
  created() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPositions);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
};
</script>

<style>
body,
html {
  height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  /* align-items: center;
  margin-top: 26vh;
  text-align: center;
  display: grid;
  grid-template-rows: repeat(auto-fit, minmax(10rem, 1fr)); */
}
canvas {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.fa-tint {
  color: #2764a0;
}
</style>
