<template>
    <div>
        <!-- <div v-if="loading" :class="{ loader: loading}">
            <div class="loader-icon">
                <font-awesome-icon v-if="loading" icon="spinner" size="5x" spin />
                <p><b>Loading...</b></p>
            </div>
        </div> -->
        <div class="display" :class="{ 'loading-color': loading }">
            <div class="icon-card">
                <div v-if="!loading">
                    <skycon v-bind:condition="current.theIcon" :width="100" :height="100" align="right" />
                    <div class="description">{{today.summary}}</div>
                </div>
                <div v-if="loading" style="padding-top: 1em">
                    <font-awesome-icon icon="coffee" size="5x" />
                    <div class="search-text">Searching..</div>
                </div>
            </div>
            <div class="current-weather">
                <div class="degree">
                    <font-awesome-icon v-if="loading" icon="spinner" spin />
                    <div v-if="!loading">{{checked ? current.tempC : current.tempF}}&deg;{{ checked ? 'C' : 'F'}}</div>
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
                    <font-awesome-icon icon="tint" />: <span v-if="loading">--</span> <span v-if="!loading">{{current.rainPercent}}%</span>
                </div>
                <div class="text">
                    UV: 
                    <span v-if="loading">--</span>
                    <span v-if="!loading">{{current.uvLevel}}/10</span>
                </div>
            </div>
            <label class="switch">
                <input type="checkbox" v-model="checked" @click="$emit('scaleClicked')" />
                <span class="slider" data-on="C" data-off="F" ></span>
            </label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CurrentWeather',
    props: ["weather", "loading"],
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
        ,
        setDegreeScaleOnKeyPress(boolVal) {
            if (this.checked != boolVal) {
                this.$emit('scaleClicked', this.checked);
                //console.log('Event detected: ' + event.keyCode + ' Value: ' + this.checked);
            }
        }
    },
    mounted() {
        let self = this;

        window.addEventListener('keyup', function(event) {
            if (event.keyCode == 109) { // 67, replaced c interfered with typing
                // if (self.checked != true) {
                //     self.checked = true;
                //     self.$emit('scaleClicked', self.checked);
                //     console.log('Event detected: ' + event.keyCode + ' Value: ' + self.checked);
                // }
                self.setDegreeScaleOnKeyPress(true);
                self.checked = true;
            }
            if (event.keyCode == 107) { // 70, replaced f interfered with typing
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
.display {
    width: 400px;
    display: grid;
    grid-template-columns: 1fr 2fr 0fr;
    margin: 0 auto;
    z-index: 1;
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