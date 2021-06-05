<template>
    <div class="grid justify-items-center">
        <div class="pb-10">
            <p class="text-lg pb-2">Train Connections:</p>
        </div>
        <table class="table-auto shadow-sm"
                :class="{ active: index == currentIndex }"
                v-for="(trainConnection, index) in trainConnections"
                :key="index"
                @click="setActiveTrainConnection(trainConnection, index)"
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

let startStation:       string;
let endStation:         string;
let connectionsService: TrainConnectionsService;

export default defineComponent({
    name: "trainConnectionsList",
    data() {
        return {
            trainConnections:   [] as unknown as TrainConnection,
            currentConnection:  [] as unknown as TrainConnection,
            currentIndex:       -1,
            title:              "",
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
        retrieveTrainConnectionsStartStation() {
            connectionsService.getAllWithStartStation(startStation)
                .then((res: ResponseData) => {
                    this.trainConnections = res.data;
                })
                .catch((err: Error) => {
                    console.log(err);
                });
        },
        retrieveTrainConnectionsEndStation() {
            connectionsService.getAllWithEndStation(endStation)
                .then((res: ResponseData) => {
                    this.trainConnections = res.data;
                })
                .catch((err: Error) => {
                    console.log(err);
                });
        },
        retrieveTrainConnectionsStartAndEndStation() {
            connectionsService.getAllWithStartAndEndStation(startStation, endStation)
                .then((res: ResponseData) => {
                    this.trainConnections = res.data;
                })
                .catch((err: Error) => {
                    console.log(err);
                });
        },
        refreshList() {
            this.retrieveTrainConnectionsAll();
            this.currentConnection = {} as TrainConnection;
            this.currentIndex      = -1;
        },
        setActiveTrainConnection(trainConnection: TrainConnection, index = -1) {
            this.currentConnection = trainConnection;
            this.currentIndex      = index;
        },
    },
    mounted() {
        connectionsService = new TrainConnectionsService();

        if(this.$route.query.startstation)
            startStation = this.$route.query.startstation.toString();
        
        if(this.$route.query.endstation)
            endStation = this.$route.query.endstation.toString();

        if(startStation && endStation) {
            this.retrieveTrainConnectionsStartAndEndStation();
            return;
        }
        if(startStation) {
            this.retrieveTrainConnectionsStartStation();
            return;
        }
        if(endStation) {
            this.retrieveTrainConnectionsEndStation();
            return;
        }

        this.retrieveTrainConnectionsAll();
    },
    setup() {
        
    },
})
</script>