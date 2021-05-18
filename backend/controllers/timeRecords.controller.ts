import { timeRecord } from "../models/timeRecord"
import { Request, Response} from "express";

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
            })
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
            })
        }
        else {
            res.send(result);
        }
    });
}

const findRecords = (req: Request, res: Response) => {
    const timeOfScrape:	any = req.query.timeOfScrape;
    const startStation: any = req.query.startStation;
    const endStation:   any = req.query.endStation;

    const filter = {
        "timeOfScrape":   timeOfScrape,
        "startStation":   startStation,
        "endStation":     endStation
    }

    timeRecord.find(filter).exec((err, result) => {
        if(err) {
            res.status(500).send({
                message:    err.message
            })
        }
        else {
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
            })
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
            })
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