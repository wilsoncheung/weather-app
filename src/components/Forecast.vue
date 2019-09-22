<template>
    <div class="forecast" :class="{ 'loading-color': loading }">
        <div v-for="forecast in updatedForecasts" v-bind:key="forecast.id" class="forecast-details">
            <div class="date">
                <div>{{forecast.date}}</div>
                <div>{{forecast.dayOfWeek}}</div>
            </div>
            <font-awesome-icon v-if="loading" icon="spinner" size="3x" spin />
            <skycon  v-if="!loading" v-bind:condition="forecast.icon" :width="45" :height="45" />
            <div class="degrees">
                <div v-if="loading">-- | --</div>
                <div v-if="!loading">{{changeScale ? forecast.highTempC : forecast.highTempF}}&deg; | {{changeScale ? forecast.lowTempC : forecast.lowTempF}}&deg;</div>
            </div>
            <div class="rain-percent">
                <font-awesome-icon icon="tint" /> <span v-if="loading"> --</span> <span v-if="!loading"> {{forecast.rainPercent}}%</span>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    name: 'Forecast',
    props: ["weather", "changeScale", "loading"],
    data() {
        return {
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
.loading-color {
    color: #a2a2a2;
}
.fa-spinner {
    margin: 0 auto;
}
.forecast {
    display: grid;
    grid-template-columns: repeat(5, minmax(1em, 7em));
    grid-auto-rows: minmax(50px, auto);
    margin: 1em auto;
    /* width: 50%; */
}
.forecast-details {
    display: grid;
    grid-template-rows: 40px 62px 25px;       
    font-weight: bold;
}
</style>