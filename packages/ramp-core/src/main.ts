import Vue from 'vue';
import { Store } from 'vuex';

import App from '@/app.vue';
import { createStore, RootState } from '@/store';

const store: Store<RootState> = createStore();

Vue.config.productionTip = false;

new Vue({
    store,
    render: h => h(App)
}).$mount('#app');
