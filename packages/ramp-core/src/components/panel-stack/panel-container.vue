<template>
    <div class="shadow-tm bg-white h-full xs:mr-0 sm:mr-12 last:mr-0 pointer-events-auto" :style="panel.style">
        <!-- this renders a panel screen which is currently in view -->

        <!-- only perform transition on screen components that are not loaded yet; if already loaded, switch right away -->
        <transition mode="out-in" :css="false" @before-leave="beforeLeave" @leave="leave" @enter="enter">
            <component :is="panel.route.screen" v-bind="panel.route.props" :panel="panel" v-focus-list></component>
        </transition>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Get, Sync, Call } from 'vuex-pathify';

import anime from 'animejs';

import PanelScreenV from './panel-screen.vue';
import PinV from './controls/pin.vue';
import CloseV from './controls/close.vue';
import BackV from './controls/back.vue';
import PanelOptionsMenuV from './controls/panel-options-menu.vue';
import DropdownMenuV from '@/components/controls/dropdown-menu.vue';

Vue.component('panel-screen', PanelScreenV);
Vue.component('pin', PinV);
Vue.component('close', CloseV);
Vue.component('back', BackV);
Vue.component('panel-options-menu', PanelOptionsMenuV);
Vue.component('dropdown-menu', DropdownMenuV);

import { PanelInstance } from '@/api';

@Component
export default class PanelContainerV extends Vue {
    @Prop() panel!: PanelInstance;

    /**
     * Indicates if the transition should be skipped.
     */
    skipTransition: boolean = false;

    enter(el: HTMLElement, done: () => void): void {
        this.animateTransition(el, done, [0, 1]);
    }

    beforeLeave(el: HTMLElement): void {
        // this will also trigger when the loading component is transitioning out; in such cases skip executing this function
        if (el.classList.contains('screen-spinner')) {
            return;
        }

        // if the screen component is already loaded; if so, skip the transition
        this.skipTransition = this.panel.isScreenLoaded(this.panel.route.screen);

        // with transition, even if it's instanteneous, there is that annoying flicker when the focus ring is set
        // just before the component is removed from DOM; supress the focus ring on the screen component just before `leave` event
        this.$el.querySelectorAll('[focus-item').forEach(element => element.classList.remove('default-focus-style'));
    }

    leave(el: HTMLElement, done: () => void): void {
        this.animateTransition(el, done, [1, 0]);
    }

    /**
     * Animate transition between panel screen components by fading them in/out.
     */
    animateTransition(el: HTMLElement, done: () => void, value: number[]): void {
        if (this.skipTransition) {
            return done();
        }

        anime({
            targets: el,
            opacity: {
                value,
                duration: 400,
                easing: 'cubicBezier(.5, .05, .1, .3)'
            },
            complete: done
        });
    }
}
</script>

<style lang="scss" scoped></style>
