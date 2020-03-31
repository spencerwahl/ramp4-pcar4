import { ActionContext, Action, Mutation } from 'vuex';
import { make } from 'vuex-pathify';

import { PanelState, PanelConfig, PanelConfigRoute } from './panel-state';
import { RootState } from '@/store/state';
import { PanelInstance } from '@/api';

type PanelContext = ActionContext<PanelState, RootState>;

type StoreActions = { [key: string]: Action<PanelState, RootState> };
type StoreMutations = { [key: string]: Mutation<PanelState> };

export enum PanelAction {
    openPanel = 'openPanel',
    closePanel = 'removePanel',
    setWidth = 'setWidth',
    updateVisible = 'updateVisible'
}

export enum PanelMutation {
    REGISTER_PANEL = 'REGISTER_PANEL',
    OPEN_PANEL = 'OPEN_PANEL',

    ADD_TO_PANEL_ORDER = 'ADD_TO_PANEL_ORDER',
    CLOSE_PANEL = 'REMOVE_PANEL',

    SET_ORDERED_ITEMS = 'SET_ORDERED_ITEMS',
    SET_PRIORITY = 'SET_PRIORITY',
    SET_VISIBLE = 'SET_VISIBLE',
    SET_WIDTH = 'SET_WIDTH'
}

const getters = {
    /**
     * Returns `visible` from the state. If the screenSize of the app is 'xs', returns only the first panel.
     *
     * @param screenSize the size of the app's screen as a string
     * @returns {PanelConfig[]}
     */
    getVisible: (state: PanelState) => (screenSize: string): PanelConfig[] => {
        if (screenSize === 'xs' && state.visible.length > 0) {
            return [state.visible.slice().pop()!];
        }

        return state.visible;
    }
};

const actions = {
    [PanelAction.openPanel](context: PanelContext, value: { panel: PanelInstance }): void {
        context.commit(PanelMutation.OPEN_PANEL, value);
        context.commit(PanelMutation.SET_PRIORITY, value);
        context.dispatch(PanelAction.updateVisible);
    },

    [PanelAction.closePanel](context: PanelContext, value: { panel: PanelConfig }): void {
        if (context.state.priority === value.panel) {
            context.commit(PanelMutation.SET_PRIORITY, null);
        }

        context.commit(PanelMutation.CLOSE_PANEL, value);
        context.dispatch(PanelAction.updateVisible);
    },

    [PanelAction.setWidth](context: PanelContext, value: number): void {
        context.commit(PanelMutation.SET_WIDTH, value);
        context.dispatch(PanelAction.updateVisible);
    },

    [PanelAction.updateVisible](context: PanelContext): void {
        //TODO: update when panel width system is in place
        let remainingWidth = context.state.stackWidth;
        let nowVisible: PanelInstance[] = [];

        // add panels until theres no space in the stack
        for (let i = context.state.orderedItems.length - 1; i >= 0 && remainingWidth >= (context.state.orderedItems[i].width || 350); i--) {
            remainingWidth -= context.state.orderedItems[i].width || 350;
            nowVisible.unshift(context.state.orderedItems[i]);
        }

        // if pinned isn't visible we need to change the order of the panels (to make it visible)
        if (context.state.pinned && !nowVisible.includes(context.state.pinned)) {
            let lastElement: PanelInstance;

            // remove elements from visible until theres room for pinned
            for (let i = 0; i < nowVisible.length - 1 && remainingWidth < (context.state.pinned.width || 350); i++) {
                lastElement = nowVisible.shift()!;
                remainingWidth += lastElement.width || 350;
            }

            if (remainingWidth >= (context.state.pinned.width || 350)) {
                // if theres room insert pinned element
                nowVisible.unshift(context.state.pinned);
            } else {
                // otherwise there is only one element in `nowVisible` (loop invariant fun)
                // if there is no priority, the one element should be pinned
                // otherwise the priority element stays as the only visible
                if (!context.state.priority) {
                    lastElement = nowVisible.shift()!;
                    nowVisible.unshift(context.state.pinned);
                }
            }

            const pinnedIndex = context.state.orderedItems.indexOf(context.state.pinned);
            const lastRemovedIndex = context.state.orderedItems.indexOf(lastElement!);
            // clone the current order, splice out the pinned item, insert it back in after the last element we removed from visible
            const newPanelOrder = context.state.orderedItems.slice();
            newPanelOrder.splice(pinnedIndex, 1);
            newPanelOrder.splice(lastRemovedIndex, 0, context.state.pinned);

            context.commit(PanelMutation.SET_ORDERED_ITEMS, newPanelOrder);
        } else {
            context.commit(PanelMutation.SET_PRIORITY, null);
        }

        context.commit(PanelMutation.SET_VISIBLE, nowVisible);
    }
};

const mutations = {
    [PanelMutation.REGISTER_PANEL](state: PanelState, { panel }: { panel: PanelInstance }): void {
        state.items = { ...state.items, [panel.id]: panel };
    },

    [PanelMutation.OPEN_PANEL](state: PanelState, { panel }: { panel: PanelInstance }): void {
        state.orderedItems = [...state.orderedItems, panel];
    },

    [PanelMutation.CLOSE_PANEL](state: PanelState, { panel }: { panel: PanelInstance }): void {
        const index = state.orderedItems.indexOf(panel);
        state.orderedItems = [...state.orderedItems.slice(0, index), ...state.orderedItems.slice(index + 1)];
    }
};

export function panel() {
    const state = new PanelState();

    return {
        namespaced: true,
        state,
        getters: { ...getters },
        actions: { ...actions },
        mutations: { ...mutations, ...make.mutations(state) }
    };
}
