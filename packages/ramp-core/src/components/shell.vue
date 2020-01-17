<template>
    <div class="h-full">
        <p>{{ title }}</p>
        <esri-map></esri-map>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Get, Sync, Call, get } from 'vuex-pathify';

import EsriMap from '@/components/map/esri-map.vue';
import { Layer } from '@/store/modules/layers';

@Component({
    components: {
        EsriMap
    }
})
export default class Shell extends Vue {
    @Sync('legend/title') title!: string;

    @Get('layers/getLayerById') getLayerById!: (id: string) => Layer | undefined;

    mounted(): void {
        this.title = 'using sync';
        (window as any).store = this.$store;
        console.log(this.getLayerById('hello world'));
    }
}
</script>

<style lang="scss" scoped></style>
