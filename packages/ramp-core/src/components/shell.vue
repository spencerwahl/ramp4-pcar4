<template>
    <div class="h-full">
        <p>{{ title }}</p>
        <esri-map></esri-map>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Get, Sync, Call } from 'vuex-pathify';

import EsriMap from './map/esri-map.vue';
import { Layer, LayerStore } from '../store/modules/layers';

@Component({
    components: {
        EsriMap
    }
})
export default class Shell extends Vue {
    @Sync('legend/title') title!: string;

    @Get(LayerStore.getLayerById) getLayerById!: (id: string) => Layer | string;

    mounted(): void {
        this.title = 'New title';
        (window as any).store = this.$store;
        console.log(this.getLayerById('hello world'));
    }
}
</script>

<style lang="scss" scoped></style>
