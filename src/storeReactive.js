import {
    reactive
} from "vue";

const state = reactive({
    userTable: 0,
});

export function getUserTable() {
    return state.userTable;
}

export function setUserTable(value) {
    state.userTable = value;
}