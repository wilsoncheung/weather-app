import Vue from 'vue'
import App from './App.vue'
import VueSkycons from 'vue-skycon'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faTint } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

library.add(faSearch, faTint);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('font-awesome-layers-text', FontAwesomeLayersText);

Vue.config.productionTip = false;

Vue.use(VueSkycons);

new Vue({
  render: h => h(App),
}).$mount('#app')
