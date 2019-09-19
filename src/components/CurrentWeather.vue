<template>
    <div class="display">
        <div class="icon-card">
            <skycon v-bind:condition="current.theIcon" :width="100" :height="100" align="right" />
            <div class="description">{{today.summary}}</div>
        </div>
        <div class="current-weather">
            <div class="degree">
                {{checked ? current.tempC : current.tempF}}&deg;{{ checked ? 'C' : 'F'}}
            </div>
            <!-- <div class="location">{{place}}</div> -->
            <div class="text">High: {{checked ? current.highTempC : current.highTempF}}&deg;</div>
            <div class="text">Low: {{checked ? current.lowTempC : current.lowTempF}}&deg;</div>
            <div class="text">
                <font-awesome-icon icon="tint" />: {{current.rainPercent}}%
            </div>
            <div class="text">UV: {{current.uvLevel}}/10</div>
        </div>
        <label class="switch">
            <input type="checkbox" v-model="checked" @click="$emit('scaleClicked')" />
            <span class="slider" data-on="C" data-off="F" ></span>
        </label>
    </div>
</template>

<script>
// import moment from 'moment'

export default {
    name: 'CurrentWeather',
    props: ["weather"],
    data() {
        return {
            checked: false,
            today: {
                tempF: 0,
                tempC: 0,
                icon: '',
                highTempF: 0,
                lowTempF: 0,
                highTempC: 0,
                lowTempC: 0,
                uvLevel: 0,
                rainPercent: 0,
                summary: ''
            }
        }
    },
    methods: {
        celsiusConversion(f) {
            return Math.ceil((f - 32) * (5/9));
        }
    },
    computed: {
        current() {
            let self = this;
            return self.today = {
                tempF: Math.ceil(this.weather.currently.temperature),
                tempC: this.celsiusConversion(this.weather.currently.temperature),
                theIcon: this.weather.currently.icon,
                highTempF: Math.ceil(this.weather.daily.data[0].temperatureHigh),
                highTempC: this.celsiusConversion(this.weather.daily.data[0].temperatureHigh),
                lowTempF: Math.ceil(this.weather.daily.data[0].temperatureLow),
                lowTempC: this.celsiusConversion(this.weather.daily.data[0].temperatureLow),
                uvLevel: this.weather.currently.uvIndex,
                rainPercent: Math.ceil(this.weather.currently.precipProbability * 100),
                summary: this.weather.currently.summary
            }
        }
    }
}
</script>

<style scoped>
.display {
    width: 400px;
    display: grid;
    grid-template-columns: 1fr 2fr 0fr;
    margin: 0 auto;
}
.icon-card {
    display: grid;
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
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  margin: 1em auto;
}
.switch input {
    display:none;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}
.slider:before {
  position: absolute;
  content: attr(data-off);
  line-height:26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}
input:checked + .slider {
  background-color: #2196F3;
}
input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}
input:checked + .slider:before {
  content: attr(data-on);
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
</style>