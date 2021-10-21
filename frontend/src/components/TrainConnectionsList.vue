<template>
    <div class="grid justify-items-center">
        <div class="pb-10">
            <p class="text-lg pb-2">Train Connections:</p>
        </div>
        <table class="table-auto shadow-sm"
                v-for="(trainConnection, index) in trainConnections"
                :key="index"
            >
            <tr class="shadow-sm cursor-pointer hover:bg-gray-100">
                <router-link :to="`/records/${trainConnection.startStation}/${trainConnection.endStation}`">
                    {{ `${trainConnection.startStation} / ${trainConnection.endStation}` }}
                </router-link>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { TrainConnectionsService } from "../services/TrainConnectionsService";
import { TrainConnection } from "../types/TrainConnection";
import { ResponseData } from "../types/ResponseData"

let connectionsService: TrainConnectionsService;

export default defineComponent({
    name: "trainConnectionsList",
    data() {
        return {
            trainConnections:   [] as TrainConnection[],
        };
    },
    methods: {
        retrieveTrainConnectionsAll() {
            connectionsService.getAll()
                .then((res: ResponseData) => {
                    this.trainConnections = res.data;
                })
                .catch((err: Error) => {
                    console.log(err);
                });
        },
    },
    mounted() {
        connectionsService = new TrainConnectionsService();

        this.retrieveTrainConnectionsAll();
    },
    setup() {

    },
})
</script>