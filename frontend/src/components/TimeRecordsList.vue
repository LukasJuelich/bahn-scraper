<template>
    <div class="grid justify-items-center">
        <div class="pb-10">
            <p class="text-lg pb-2">Choose Timeframe:</p>
            <span class="pr-5">From: <input type="date"  class=""></span>
            <span>To:   <input type="date" class=""></span>
        </div>
        <table class="table-auto shadow-sm">
            <tr style="background:#E7E7E7">
                <th class="px-4 py-2">Time of scrape</th>
                <th class="px-4 py-2">Planned Departure</th>
                <th class="px-4 py-2">Delay</th>
            </tr>
            <tr class="shadow-sm cursor-pointer hover:bg-gray-100"
                :class="{ active: index == currentIndex }"
                v-for="(record, index) in timeRecords"
                :key="index"
                @click="setActiveRecord(record, index)"
                >
                <td class="px-4 py-2">
                    {{ format(new Date(record.timeOfScrape), 'HH:mm dd.MM.yyy' ) }}
                </td>
                <td class="text-gray-600 px-4 py-2">
                    {{ format(new Date(record.departure), 'HH:mm' ) }}
                </td>
                <td class="px-4 py-2">
                    {{ format(new Date(record.delay), 'HH:mm') }}
                </td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { TimeRecordsService } from "../services/TimeRecordsService"
import { TimeRecord } from "../types/TimeRecord"
import { ResponseData } from "../types/ResponseData"
import { format } from "date-fns"

let startStation: string    = "Horrem";
let endStation: string      = "Aachen";
let recordsService: TimeRecordsService;
let startDate:  Date;
let endDate:    Date;
let recordId:   string;

export default defineComponent({
    name: "timeRecordsList",
    data() {
        return {
            timeRecords:    [] as unknown as TimeRecord,
            currentRecord:  [] as unknown as TimeRecord,
            currentIndex:   -1,
            title:          "",
        };
    },
    methods: {
        retrieveTimeRecordsAll() {
            recordsService.getAll()
                .then((res: ResponseData) => {
                    this.timeRecords = res.data;
                    console.log(res.data);
                })
                .catch((err: Error) => {
                    console.log(err);
                })
        },        
        retrieveTimeRecordsStartDate() {
            recordsService.getWithStartDate(startDate)
                .then((res: ResponseData) => {
                    this.timeRecords = res.data;
                    console.log(res.data);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
        },
        retrieveTimeRecordsEndDate() {
            recordsService.getWithEndDate(endDate)
            .then((res: ResponseData) => {
                    this.timeRecords = res.data;
                    console.log(res.data);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
        },
        retrieveTimeRecordsStartAndEndDate() {
            recordsService.getWithStartAndEndDate(startDate, endDate)
                .then((res: ResponseData) => {
                    this.timeRecords = res.data;
                    console.log(res.data);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
        },
        retrieveTimeRecordsById() {
            recordsService.getWithId(recordId)            
                .then((res: ResponseData) => {
                    this.timeRecords = res.data;
                    console.log(res.data);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
        },
        refreshList() {
            this.retrieveTimeRecordsAll();
            this.currentRecord  = {} as TimeRecord;
            this.currentIndex   = -1;
        },
        setActiveRecord(timeRecord: TimeRecord, index = -1) {
            this.currentRecord  = timeRecord;
            this.currentIndex   = index;
            console.log(this.currentRecord.id);
        },
        format,

    },
    mounted() {
        startStation    = this.$route.params.startStation.toString();
        endStation      = this.$route.params.endStation.toString();

        recordsService = new TimeRecordsService(startStation, endStation)
        
        this.retrieveTimeRecordsAll();
    },

    setup() {

    },
})
</script>
