import { client } from "../http-common";

class TrainConnectionsService {
    startStation:   string = "";
    endStation:     string = "";

    constructor() {
    }

    getAll(): Promise<any> {
        return client.get(`/trainconnections`);
    }

    getAllWithStartStation(startStation: string): Promise<any> {
        return client.get(`/trainconnections?startstation=${startStation}`);
    }

    getAllWithEndStation(endStation: string): Promise<any> {
        return client.get(`/trainconnections?endstation=${endStation}`);
    }

    getAllWithStartAndEndStation(startStation: string, endStation: string): Promise<any> {
        return client.get(`/trainconnections?startstation=${startStation}&endstation=${endStation}`);
    }
}

export {TrainConnectionsService};