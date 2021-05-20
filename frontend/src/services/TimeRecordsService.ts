import { client } from "../http-common";

class TimeRecordsService {
    startStation:   string = "";
    endStation:     string = "";
    stations:       string = "";

    constructor(startStation: string, endStation: string) {
        this.startStation   = startStation;
        this.endStation     = endStation;
        this.stations       = "/" + this.startStation  + "/" + this.endStation;
    }

    getAll(): Promise<any> {
        return client.get(this.stations);
    }

    getWithStartDate(date: Date): Promise<any> {
        return client.get(this.stations + "?startDate=" + date);
    }

    getWithEndDate(date: Date): Promise<any> {
        return client.get(this.stations + "?endDate=" + date);
    }

    getWithStartAndEndDate(startDate: Date, endDate: Date): Promise<any> {
        return client.get(this.stations + "?startDate=" + startDate + "?endDate=" + endDate);
    }

    getWithId(id: string): Promise<any> {
        return client.get(id);
    }
}

export {TimeRecordsService};