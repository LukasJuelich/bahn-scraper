<template>
    <div class="grid justify-items-center space-y-3">
        <div class="space-y-4">
            <div class="text-lg pb-2">
                Choose Timeframe:
            </div>
            <div class="space-x-8 sm:space-x-16">
                <span>
                    From:
                    <input type="date" v-model="startDate" @change="refreshList" class="">
                </span>
                <span>
                    To:
                    <input type="date" v-model="endDate" @change="refreshList" class="">
                </span>
            </div>
            <div class="space-x-10">
                <button type="button" class="btn btn-red" @click="prevoiusPage">
                    &lt;
                </button>
                <button type="button" class="btn btn-red" @click="nextPage">
                    &gt;
                </button>
            </div>
        </div>
        <table class="table-auto shadow-sm">
            <tr style="background:#E7E7E7">
                <th class="sm:px-4 px-2 py-2">Time of scrape</th>
                <th class="sm:px-4 px-2 py-2">Planned Departure</th>
                <th class="sm:px-4 px-2 py-2">Delay</th>
                <th class="sm:px-4 px-2 py-2">Difference</th>
            </tr>
            <tr class="shadow-sm cursor-pointer hover:bg-gray-100"
                v-for="(record, index) in timeRecordsPage"
                :key="index"
                >
                <td class="sm:px-4 px-2 py-2">
                    {{ format(new Date(record.timeOfScrape), 'HH:mm dd.MM.yyy' ) }}
                </td>
                <td class=" sm:px-4 px-2 py-2">
                    {{ format(new Date(record.departure), 'HH:mm' ) }}
                </td>
                <td class="sm:px-4 px-2 py-2">
                    {{ format(new Date(record.delay), 'HH:mm') }}
                </td>
                <td class="sm:px-4 px-2 py-2 text-red-700">
                    {{ format(new Date(record.delay) - new Date(record.departure), 'mm') }}
                </td>
            </tr>
        </table>
        <div class="space-x-10">
            <button type="button" class="btn btn-red" @click="prevoiusPage">&lt;</button>
            <button type="button" class="btn btn-red" @click="nextPage">&gt;</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { TimeRecordsService } from "../services/TimeRecordsService"
import { ResponseData } from "../types/ResponseData"
import { format, addDays, subDays } from "date-fns"

let recordsService: TimeRecordsService;

let startStation: string;
let endStation: string;

let today = new Date();
let startDate:  any = format(subDays(today, 7), 'yyyy-MM-dd');
let endDate:    any = format(today, 'yyyy-MM-dd');

export default defineComponent({
    name: "timeRecordsList",
    data() {
        return {
            timeRecords:        [],
            timeRecordsPage:    [],
            title:              "",
            startDate:          startDate,
            endDate:            endDate,
            pageSize:           10,
            currentPage:        1,
            numberOfPages:      1,
        };
    },
    methods: {
        format,
        async retrieveTimeRecordsStartAndEndDate() {
            await recordsService.getWithStartAndEndDate(
                new Date(this.startDate), 
                addDays(new Date(this.endDate), 1)
            )
            .then((res: ResponseData) => {
                this.timeRecords = res.data;
            })
            .catch((err: Error) => {
                console.log(err);
            });
        },
        refreshList() {
            this.retrieveTimeRecordsStartAndEndDate()
                .then(() => {
                    this.numberOfPages = Math.ceil(this.timeRecords.length / this.pageSize);
                    this.paginate();
                });
        },
        
        paginate() {
            this.timeRecordsPage = this.timeRecords.slice(
                (this.currentPage-1) * this.pageSize, 
                this.currentPage * this.pageSize
            );
        },
        prevoiusPage() {
            if(this.currentPage > 1) {
                this.currentPage--;
                this.paginate();
            }
        },
        nextPage() {
            if(this.currentPage < this.numberOfPages){
                this.currentPage++;
                this.paginate();
            }
        },
    },
    mounted() {
        startStation    = this.$route.params.startStation.toString();
        endStation      = this.$route.params.endStation.toString();

        recordsService = new TimeRecordsService(startStation, endStation)
        
        this.refreshList();
    },
    setup() {
    },
})
</script>