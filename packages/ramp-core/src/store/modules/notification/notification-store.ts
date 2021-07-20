import { ActionContext, Action, Mutation } from 'vuex';
import { make } from 'vuex-pathify';

import { Notification, NotificationState } from './notification-state';
import { NotificationGroup } from '@/api';
import { RootState } from '@/store/state';
import { Context } from 'ag-grid-community';

type NotificationContext = ActionContext<NotificationState, RootState>;

type StoreActions = { [key: string]: Action<NotificationState, RootState> };
type StoreMutations = { [key: string]: Mutation<NotificationState> };

export enum NotificationAction {}

export enum NotificationMutation {}

const getters = {
    notificationNumber: (state: NotificationState): Number => {
        return state.notificationStack.length;
    }
};

const actions = {
    showNotification(context: NotificationContext, notification: Notification) {
        context.commit('SHOW_NOTIFICATION', notification);
    },
    removeNotification(
        context: NotificationContext,
        notification: Notification | NotificationGroup
    ) {
        if (context.state.notificationStack.includes(notification)) {
            if (notification instanceof NotificationGroup) {
                context.commit('REMOVE_GROUP', notification);
            }
            context.commit('REMOVE_NOTIFICATION', notification);
        }
    },
    registerGroup(context: NotificationContext, group: NotificationGroup) {
        context.commit('REGISTER_GROUP', group);
    },
    addToGroup(
        context: NotificationContext,
        value: { id: string; message: string }
    ) {
        if (context.state.groups[value.id]) {
            context.commit('ADD_TO_GROUP', value);

            if (
                !context.state.notificationStack.includes(
                    context.state.groups[value.id]
                )
            ) {
                context.commit('SHOW_GROUP', value.id);
            }
        }
    }
};

const mutations = {
    SHOW_NOTIFICATION(state: NotificationState, notification: Notification) {
        state.notificationStack = [notification, ...state.notificationStack];
    },
    REMOVE_NOTIFICATION(
        state: NotificationState,
        notification: Notification | NotificationGroup
    ) {
        const index = state.notificationStack.indexOf(notification);
        if (index > -1) {
            state.notificationStack.splice(index, 1);
        }
    },
    ADD_TO_GROUP(
        state: NotificationState,
        value: { id: string; message: string }
    ) {
        state.groups[value.id].messageList.push(value.message);
    },
    SHOW_GROUP(state: NotificationState, id: string) {
        state.notificationStack = [
            state.groups[id],
            ...state.notificationStack
        ];
    },
    REMOVE_GROUP(state: NotificationState, group: NotificationGroup) {
        const index = state.notificationStack.indexOf(group);
        if (index > -1) {
            state.notificationStack.splice(index, 1);
        }

        group.messageList = [];
    },
    REGISTER_GROUP(state: NotificationState, group: NotificationGroup) {
        console.log(group);
        console.log(group.id);
        state.groups[group.id] = group;
    }
};

export function notification() {
    const state = new NotificationState();

    return {
        namespaced: true,
        state,
        getters: { ...getters },
        actions: { ...actions },
        mutations: { ...mutations, ...make.mutations(state) }
    };
}