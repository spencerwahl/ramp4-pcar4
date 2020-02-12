import FeatureLayer from 'ramp-geoapi/dist/layer/FeatureLayer';
import BaseLayer from 'ramp-geoapi/dist/layer/BaseLayer';

export class LayerState {
    layers: BaseLayer[];

    constructor(layers: BaseLayer[]) {
        this.layers = layers;
    }
}
