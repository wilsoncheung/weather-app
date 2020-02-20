<template>
  <!--display-->
  <div class="row col-lg-6 col-md-8 col-sm-12 text-center" :class="{ 'loading-color': loading }">
    <div class="icon-card col-3 text-center mt-2">
      <div v-if="!loading">
        <skycon v-bind:condition="current.theIcon" :width="100" :height="100" align="right" />
        <div class="description">{{today.summary}}</div>
      </div>
      <div v-if="loading" style="padding-top: 1em">
        <font-awesome-icon icon="coffee" size="5x" />
        <div class="search-text">Searching..</div>
      </div>
    </div>
    <div class="current-weather col-6">
      <div class="degree text-center">
        <font-awesome-icon v-if="loading" icon="spinner" spin />
        <div
          v-if="!loading"
        >{{checked ? current.tempC : current.tempF}}&deg;{{ checked ? 'C' : 'F'}}</div>
      </div>
      <!-- <div class="location">{{place}}</div> -->
      <div class="text">
        High:
        <span v-if="loading">--</span>
        <span v-if="!loading">{{checked ? current.highTempC : current.highTempF}}&deg;</span>
      </div>
      <div class="text">
        Low:
        <span v-if="loading">--</span>
        <span v-if="!loading">{{checked ? current.lowTempC : current.lowTempF}}&deg;</span>
      </div>
      <div class="text">
        <font-awesome-icon icon="tint" />:
        <span v-if="loading">--</span>
        <span v-if="!loading">{{current.rainPercent}}%</span>
      </div>
      <div class="text">
        UV:
        <span v-if="loading">--</span>
        <span v-if="!loading">{{current.uvLevel}}/10</span>
      </div>
    </div>
    <div class="col-3 text-left">
      <label class="switch mt-4">
        <input type="checkbox" v-model="checked" @click="$emit('scaleClicked')" />
        <span class="slider" data-on="C" data-off="F"></span>
      </label>
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        data-toggle="modal"
        data-target="#hourlyForecast"
      >
        <font-awesome-icon icon="clock" />&nbsp;Hourly
      </button>
    </div>
    <div
      class="modal fade"
      id="hourlyForecast"
      tabindex="-1"
      role="dialog"
      aria-labelledby="hourlyForecast"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <!-- <h5 class="modal-title" id="hourlyForecast">
              <strong>{{current.date}}</strong>
            </h5>-->
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <zingchart :data="chartData"></zingchart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "CurrentWeather",
  props: ["weather", "loading"],
  data() {
    return {
      checked: false,
      today: {
        tempF: 0,
        tempC: 0,
        icon: "",
        highTempF: 0,
        lowTempF: 0,
        highTempC: 0,
        lowTempC: 0,
        uvLevel: 0,
        rainPercent: 0,
        summary: ""
      }
    };
  },
  methods: {
    celsiusConversion(f) {
      return Math.ceil((f - 32) * (5 / 9));
    },
    setDegreeScaleOnKeyPress(boolVal) {
      if (this.checked != boolVal) {
        this.$emit("scaleClicked", this.checked);
        //console.log('Event detected: ' + event.keyCode + ' Value: ' + this.checked);
      }
    }
  },
  mounted() {
    let self = this;

    window.addEventListener("keyup", function(event) {
      if (event.keyCode == 109) {
        // 67, replaced c interfered with typing
        // if (self.checked != true) {
        //     self.checked = true;
        //     self.$emit('scaleClicked', self.checked);
        //     console.log('Event detected: ' + event.keyCode + ' Value: ' + self.checked);
        // }
        self.setDegreeScaleOnKeyPress(true);
        self.checked = true;
      }
      if (event.keyCode == 107) {
        // 70, replaced f interfered with typing
        // if (self.checked != false) {
        //     self.checked = false;
        //     self.$emit('scaleClicked', self.checked);
        //     console.log('Event detected: ' + event.keyCode + ' Value: ' + self.checked);
        // }
        self.setDegreeScaleOnKeyPress(false);
        self.checked = false;
      }
    });
  },
  computed: {
    current() {
      let self = this;

      return (self.today = {
        tempF: Math.ceil(this.weather.currently.temperature),
        tempC: this.celsiusConversion(this.weather.currently.temperature),
        theIcon: this.weather.currently.icon,
        highTempF: Math.ceil(this.weather.daily.data[0].temperatureHigh),
        highTempC: this.celsiusConversion(
          this.weather.daily.data[0].temperatureHigh
        ),
        lowTempF: Math.ceil(this.weather.daily.data[0].temperatureLow),
        lowTempC: this.celsiusConversion(
          this.weather.daily.data[0].temperatureLow
        ),
        uvLevel: this.weather.currently.uvIndex,
        rainPercent: Math.ceil(this.weather.currently.precipProbability * 100),
        summary: this.weather.currently.summary,
        humidity: this.weather.currently.humidity,
        date: moment(this.weather.currently.time * 1000).format(
          "MMM DD, YYYY | dddd"
        )
      });
    },
    hourly() {
      return this.weather.hourly.data.slice(0, 13).map(h => ({
        id: h.time,
        date: moment(h.time * 1000).format("MMM DD, YYYY ddd"),
        time: moment(h.time * 1000).format("h:mm A"),
        dayOfWeeK: moment(h.time * 1000).format("ddd"),
        icon: h.icon,
        summary: h.summary,
        tempF: Math.ceil(h.temperature),
        tempC: this.celsiusConversion(h.temperature),
        rainPercent: Math.ceil(h.precipProbability * 100),
        uvLevel: h.uvIndex,
        humidity: h.humidity
      }));
    },
    chartData() {
      return {
        type: "area",
        title: {
          text: "Hourly Forecast",
          "font-size": "28px",
          "adjust-layout": true,
          color: "#2c3e50"
        },
        subtitle: {
          text: this.current.date,
          "font-size": "14px",
          color: "#2c3e50"
        },
        plot: {
          aspect: "spline",
          "value-box": {
            text: this.checked ? "%v C" : "%v F"
          },
          tooltip: {
            visible: false
          },
          "active-area": true
        },
        "scale-x": {
          label: {
            text: "Time",
            "font-size": 13
          },
          "min-value": this.hourly[0].id * 1000,
          "max-value": this.hourly[12].id * 1000,
          step: "1hour", // "30minute"
          transform: {
            type: "date",
            all: "%g %a" //"%M %d <br> %D <br> %g:%i %a"
          },
          "items-overlap": true,
          "max-items": 12,
          item: {
            "font-size": 12,
            color: "#2c3e50"
          }
        },
        "scale-y": {
          format: this.checked ? "%v C" : "%v F",
          // values: "0:100",
          "max-value":
            Math.max.apply(
              Math,
              this.hourly.map(h => (this.checked ? h.tempC : h.tempF))
            ) + 10,
          label: {
            text: "Temperature",
            "font-size": 11
          },
          item: {
            "font-size": 12,
            color: "#2c3e50"
          },
          guide: {
            "line-style": "solid"
          }
        },
        series: [
          {
            values: this.hourly.map(h => [
              h.id * 1000,
              this.checked ? h.tempC : h.tempF
            ]),
            marker: {
              /* Marker object */
              "background-color": "#FF0066" /* hexadecimal or RGB value */,
              size: 3 /* in pixels */,
              "border-color": "#6666FF" /* hexadecimal or RBG value */,
              "border-width": 2 /* in pixels */
            },
            "background-color":
              "#6666FF #FF0066" /* Single color or gradient (2 colors) */,
            "alpha-area": 0.5 /* Shaded region transparency */
          }
        ]
      };
    }
  }
};
</script>

<style scoped>
.search-text {
  grid-column: 1 / 3;
  font-style: italic;
  font-size: 15px;
  font-weight: bold;
  margin-top: 1em;
}
.loader {
  width: 400px;
  background-color: rgba(156, 156, 156, 0.5);
  z-index: 2;
  position: absolute;
  margin: 0 auto;
  left: 0;
  right: 0;
  height: 9em;
}
.loader-icon {
  margin-top: 1em;
}
.loading-color {
  color: #a2a2a2;
}
/* .display {
  width: 400px;
  display: grid;
  grid-template-columns: 1fr 2fr 0fr;
  margin: 0 auto;
  z-index: 1;
} */
.icon-card {
  /* display: grid; */
  text-align: right;
}
.current-weather {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: minmax(25px, auto);
}
.degree {
  grid-column: 1 / 3;
  font-size: 5em;
}
.location {
  grid-column: 1 / 3;
  font-size: 12px;
  font-weight: bold;
}
.description {
  grid-column: 1 / 3;
  font-style: italic;
  font-size: 13px;
  font-weight: bold;
}
.text {
  font-size: 14px;
  font-weight: bold;
  text-align: center !important;
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  margin: 1em auto;
}
.switch input {
  display: none;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
.slider:before {
  position: absolute;
  content: attr(data-off);
  line-height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
input:checked + .slider {
  background-color: #2196f3;
}
input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}
input:checked + .slider:before {
  content: attr(data-on);
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
</style>