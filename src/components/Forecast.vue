<template>
    <div class="forecast">
        <div v-for="forecast in updatedForecasts" v-bind:key="forecast.id" class="forecast-details">
            <div class="date">
                <div>{{forecast.date}}</div>
                <div>{{forecast.dayOfWeek}}</div>
            </div>
            <skycon v-bind:condition="forecast.icon" :width="45" :height="45" />
            <div class="degrees">
                <div>{{changeScale ? forecast.highTempC : forecast.highTempF}}&deg; | {{changeScale ? forecast.lowTempC : forecast.lowTempF}}&deg;</div>
            </div>
            <div class="rain-percent">
                <font-awesome-icon icon="tint" /> {{forecast.rainPercent}}%
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    name: 'Forecast',
    props: ["weather", "changeScale"],
    data() {
        return {
            // forecasts: [],
            // NUM_OF_FORECAST: 5,
            tempDate: '',
            tempdayOfWeek: '',
            checked: false
        }
    },
    methods: {
        celsiusConversion(f) {
            return Math.ceil((f - 32) * (5/9));
        },
        timeToDate(unix_time) {
            this.tempDate = moment(unix_time * 1000).format("MMM D");
            this.tempdayOfWeek = moment(unix_time * 1000).format("ddd");
        }
    },
    computed: {
        updatedForecasts() {
            return this.weather.daily.data.slice(1,6).map(w => ({
                    id: w.time,
                    date: moment(w.time * 1000).format("MMM D"),
                    dayOfWeek: moment(w.time * 1000).format("ddd"),
                    icon: w.icon,
                    highTempF: Math.ceil(w.temperatureHigh),
                    highTempC: this.celsiusConversion(w.temperatureHigh),
                    lowTempF: Math.ceil(w.temperatureLow),
                    lowTempC: this.celsiusConversion(w.temperatureLow),
                    rainPercent: Math.ceil(w.precipProbability * 100)
                }));
        }
    }
}
</script>

<style scoped>
.forecast {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-auto-rows: minmax(50px, auto);
    margin: 3em auto;
    width: 50%;
}
.forecast-details {
    display: grid;
    grid-template-rows: 40px 62px 25px;       
    font-weight: bold;
}
</style>