import { ActionContext, Action } from 'vuex';
import { make } from 'vuex-pathify';

import { LegendState } from './legend-state';
import { RootState } from '@/store';

// use for actions
type LegendContext = ActionContext<LegendState, RootState>;

interface actions {
    [key: string]: Action<LegendState, RootState>;
}

const state: LegendState = {
    title: 'hello world'
};

// decide if these are needed
//enum Action {}

//enum Mutation {}

const getters = {};

const actions: actions = {
    ...make.actions(state)
};

const mutations = {
    ...make.mutations(state)
};

export const legend = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
