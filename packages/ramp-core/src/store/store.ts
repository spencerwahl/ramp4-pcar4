import Vue from 'vue';
import Vuex from 'vuex';
import pathify from 'vuex-pathify';

import { legend } from '@/store/modules/legend';
import { layers } from '@/store/modules/layers';
import { RootState } from '@/store/state';

Vue.use(Vuex);

export const createStore = () =>
    new Vuex.Store<RootState>({
        plugins: [pathify.plugin],
        modules: {
            legend,
            layers
        }
    });
