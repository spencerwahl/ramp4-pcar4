import { ActionContext, Action } from 'vuex';
import { make } from 'vuex-pathify';

import { LayerState } from './layer-state';
import { RootState } from '@/store';
import { RampLayerConfig } from 'ramp-geoapi';
import api from '@/api';
import BaseLayer from 'ramp-geoapi/dist/layer/BaseLayer';

// use for actions
type LayerContext = ActionContext<LayerState, RootState>;

// TODO: geoAPI?
enum configLayerTypes {
    esriFeature = 'esriFeature',
    esriDynamic = 'esriDynamic',
    esriTile = 'esriTile',
    geojson = 'geojson'
}

const addLayerMappings: { [key: string]: Function } = {
    [configLayerTypes.esriFeature]: api.geoapi.layers.createFeatureLayer,
    [configLayerTypes.esriDynamic]: api.geoapi.layers.createMapImageLayer,
    [configLayerTypes.geojson]: api.geoapi.layers.createGeoJSONLayer
};

const getters = {
    getLayerById: (state: LayerState) => (id: string): BaseLayer | undefined => {
        return state.layers.find((layer: BaseLayer) => layer.uid === id);
    }
};

const actions = {
    addLayers: (context: LayerContext, layerConfigs: RampLayerConfig[]) => {
        layerConfigs.forEach(layerConfig => {
            context.commit('ADD_LAYER', addLayerMappings[layerConfig.type](layerConfig));
        });
    }
};

function createLayer(layerConfig: any) {
    switch (layerConfig.type) {
        case 'configLayerTypes.esriFeature': {
            var a = 2;
        }
        case configLayerTypes.esriDynamic: {
        }
        default: {
            break;
        }
    }
    return 'a';
}

const mutations = {
    ADD_LAYER: (state: LayerState, value: BaseLayer) => {
        state.layers.push(value);
    }
};

export enum LayerStore {
    /**
     * (Getter) getLayerById: (id: string) => Layer | undefined
     */
    getLayerById = 'layer/getLayerById',
    /**
     * (State) layers: Layer[]
     */
    layers = 'layer/layers',
    /**
     * (Action) addLayers: (layerConfigs: RampLayerConfig[])
     */
    addLayers = 'layer/addLayers!'
}

export function layer() {
    const state = new LayerState([]);

    return {
        namespaced: true,
        state,
        getters: { ...getters },
        actions: { ...actions, ...make.actions(state) },
        mutations: { ...mutations, ...make.mutations(state) }
    };
}
