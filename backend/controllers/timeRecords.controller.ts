import { timeRecord, ITimeRecord } from "../models/timeRecord"
import { Request, Response} from "express";
import { isEqual, } from "date-fns";

const createRecord = (req: Request, res: Response) => {
    if (!req.body.timeOfScrape) {
        res.status(400).send({message: "Content empty"});
        return;
    }

    const record = new timeRecord({
        timeOfScrape:   req.body.timeOfScrape,
        departure:      req.body.departure,
        delay:          req.body.delay,
    });

    record.save(err => {
        if(err) {
            res.status(500).send({
                message:    err.message
            });
        }
        else{
            res.status(201).end();
        }
    });
}

const findRecordById = (req: Request, res: Response) => {
    const id = req.params.id;

    timeRecord.findById(id).exec((err, result) => {
        if(err) {
            res.status(500).send({
                message:    err.message
            });
        }
        else {
            res.send(result);
        }
    });
}

interface TimeOfScrapeFilter {
    $gte?:  Date;
    $lte?:  Date;
}

interface Filter {
    startStation:   string;
    endStation:     string;
    timeOfScrape?:  TimeOfScrapeFilter;
}

const findRecordsFilter = (req: Request): Filter => {
    let startDate:  any = req.query.startDate;
    let endDate:    any = req.query.endDate;
    const startStation: string = req.params.startStation;
    const endStation:   string = req.params.endStation;

    const filter: Filter = {
        startStation:   startStation,
        endStation:     endStation,
    }

    let timeOfScrapeFilter: TimeOfScrapeFilter = {};
    if(startDate) {
        startDate = new Date(startDate);
        timeOfScrapeFilter.$gte = startDate;
        filter.timeOfScrape = timeOfScrapeFilter;
    }
    if(endDate) {
        endDate = new Date(endDate);
        timeOfScrapeFilter.$lte = endDate;
        filter.timeOfScrape = timeOfScrapeFilter;
    }

    return filter;
}

const getClosestEntriesToDeparture = (timeRecords: Array<ITimeRecord>): Array<ITimeRecord> => {
    let result: Array<ITimeRecord> = [];

    timeRecords.forEach( (el, index )=> {
        if( timeRecords[index-1] ) {
            if( !isEqual(el.departure, timeRecords[index-1].departure) ) {
                result.push(el);
            }
        }
        else {
            result.push(el);
        }
    });
    return result;
}


const findRecords = (req: Request, res: Response) => {
    const filter: Filter = findRecordsFilter(req);

    timeRecord.find(filter).sort({timeOfScrape: -1}).exec((err, result) => {
        if(err) {
            res.status(500).send({
                message:    err.message
            });
        }
        else {
            result = getClosestEntriesToDeparture(result);
            res.send(result);
        }
    });
}


const findAllRecords = (req: Request, res: Response) => {
    const key: any = req.query.key;
    const value: any = req.query.value;
    const filter = { [key]: value };

    timeRecord.find(filter).exec((err, result) => {
        if(err) {
            res.status(500).send({
                message:    err.message
            });
        }
        else {
            res.send(result);
        }
    });
}

const updateRecord = (req: Request, res: Response) => {

}

const deleteRecordById = (req: Request, res: Response) => {
    const id = req.params.id;

    timeRecord.findByIdAndDelete(id).exec((err, result) => {
        if(err) {
            res.status(500).send({
                message:    err.message
            });
        }
        else {
            res.send(result);
        }
    });
}

export {
    createRecord, 
    findRecordById,
    findRecords,
    findAllRecords, 
    deleteRecordById,
};