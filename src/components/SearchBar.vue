<template>
    <div class="wrap">
        <div class="search">
            <input v-model="destination" type="text" class="search-term" placeholder="Location" v-on:keyup.enter="search" />
            <button type="submit" class="search-btn" @click="search">
                <font-awesome-icon v-if="!searching" icon="search" size="7x" />
                <font-awesome-icon v-if="searching" icon="spinner" size="7x" spin />
            </button>
        </div>
        <p v-if="searchTimeStamp != ''" class="updated-on-text">as of {{searchTimeStamp}}</p> 
    </div>
</template>

<script>
import moment from 'moment'
import $ from 'jquery'
import axios from 'axios'

export default {
    name: 'SearchBar',
    data() {
        return {
            destination: '',
            searchTimeStamp: '',
            geolocation: [],
            errors: [],
            searching: false
        }
    },
    methods: {
        getWeather() {
            let self = this;
            let latitude = self.geolocation.geometry.location.lat;
            let longitude = self.geolocation.geometry.location.lng;

            const URL = 'https://api.darksky.net/forecast/4ef00c506da530ad9b922f03b286243d/' + latitude + ',' + longitude;

            // Had to add v-if because AJAX call is asyncronous and data is not propogated to child components
            // until after it is created..
            $.ajax({
                url: URL,
                dataType: "jsonp",
                success: function(resp) {
                    //Check that the returned objects contains data
                    if (Object.keys(resp).length !== 0){
                        self.$emit('updatedWeather', resp)
                        self.searchTimeStamp = moment(resp.currently.time * 1000).format("MM/DD/YY h:mm:ss A");
                        // console.log('update api called', resp); 
                        // console.log(latitude + ', ' + longitude);  
                        self.searching = false;
                        self.$emit('isSearching', self.searching);
                    }
                },
                error: function(error) {
                    self.errors.push(error);
                    self.searching = false;
                    self.$emit('isSearching', self.searching);
                }
            });
        },
        search() {
            if (this.destination != '') {
                let self = this;

                self.searching = true;
                self.$emit('isSearching', self.searching);

                axios.get('https://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=' + self.destination + '&key=AIzaSyB4v4851zzgqR4vYwG3FZbEckU2yMavgJY')
                    .then(resp => {
                        self.geolocation = resp.data.results[0];
                        self.getWeather();
                        // console.log(resp);
                    })
                    .catch(e => {
                        self.errors.push(e);
                        self.searching = false;
                    });
            }
        }
    }
}
</script>

<style scoped>
.wrap {
    width: 25rem;
    /* position: absolute;
    top: 20%; 
    left: 50%;
    transform: translate(-50%, -50%);*/
    margin: 2em auto;
}
.search {
    width: 100%;
    position: relative;
    display: flex;
}
.search-term {
    width: 100%;
    border: 3px solid #00B4CC;
    border-right: none;
    padding: 5px;
    height: 20px;
    border-radius: 5px 0 0 5px;
    outline: none;
    color: #9DBFAF;
    text-align: center;
    text-transform: capitalize;
    font-weight: bold;
    font-size: 16px;
}
.search-term:focus {
    color: #00B4CC;
}
.search-btn {
    width: 40px;
    height: 36px;
    border: 1px solid #00B4CC;
    background: #00B4CC;
    text-align: center;
    color: #fff;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    font-size: 2px;
}
.updated-on-text {
    font-size: 12px;
    font-style: italic;
    font-weight: bolder;
    margin: 5px auto;
}
</style>