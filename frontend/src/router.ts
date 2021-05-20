import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path:       "/",
            alias:       "/connections",
            name:       "record-data",
            component:  () => import("./components/TrainConnections.vue"),
        },
        {
            path:      "/:startStation/:endStation",
            name:       "records",
            component:  () => import("./components/TimeRecordsList.vue"),
        },
    ]
});

export {router};