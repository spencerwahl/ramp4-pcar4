import { ActionContext, Action } from 'vuex';
import { make } from 'vuex-pathify';

import { LayerState, Layer } from './layer-state';
import { RootState } from '@/store';

// use for actions
type LayerContext = ActionContext<LayerState, RootState>;

interface actions {
    [key: string]: Action<LayerState, RootState>;
}

const state: LayerState = {
    layers: [
        {
            id: 'hello world',
            data: 2
        }
    ]
};

// decide if these are needed
//enum Action {}

//enum Mutation {}

const getters = {
    getLayerById: (state: LayerState) => (id: string): Layer | string => {
        return state.layers.find((layer: Layer) => layer.id === id) || 'LAYER NOT FOUND';
    }
};

const actions: actions = {
    ...make.actions(state)
};

const mutations = {
    ...make.mutations(state)
};

export const layers = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
