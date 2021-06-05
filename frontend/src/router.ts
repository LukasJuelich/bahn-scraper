import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path:       "/",
            alias:       "/trainconnections",
            name:       "connections",
            component:  () => import("./components/TrainConnectionsList.vue"),
        },
        {
            path:      "/records/:startStation/:endStation",
            name:       "records",
            component:  () => import("./components/TimeRecordsList.vue"),
        },
    ]
});

export {router};