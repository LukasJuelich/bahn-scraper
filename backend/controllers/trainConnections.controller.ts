import { trainConnection } from "../models/trainConnections"
import { Request, Response} from "express";


const createTrainConnection = (req: Request, res: Response) => {
    if (!req.params.startStation || !req.params.endStation) {
        res.status(400).send({message: "One Param missing"});
        return;
    }

    const connection = new trainConnection({
        startStation:   req.params.startStation.toString(),
        endStation:     req.params.endStation.toString(),
    });

    connection.save(err => {
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

const findTrainConnectionById = (req: Request, res: Response) => {
    const id = req.params.id;

    trainConnection.findById(id).exec((err, result) => {
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

interface startEndFilter {
    startStation?:  string;
    endStation?:    string;
}

const findTrainConnectionsFilter = (req: Request): startEndFilter => {
    const startStation: any = req.query.startStation;
    const endStation:   any = req.query.endStation;

    let filter: startEndFilter = {};

    if(startStation) {
        filter.startStation = startStation;
    }
    if(endStation) {
        filter.endStation = endStation;
    }

    return filter;
}

const findTrainConnectionsByFilter = (req: Request, res: Response) => {
    const filter: startEndFilter = findTrainConnectionsFilter(req);

    trainConnection.find(filter).exec((err, result) => {
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

const updateTrainConnection = (req: Request, res: Response) => {

}

const deleteTrainConnectionById = (req: Request, res: Response) => {
    const id = req.params.id;

    trainConnection.findByIdAndDelete(id).exec((err, result) => {
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
    createTrainConnection,
    findTrainConnectionById,
    findTrainConnectionsByFilter,
    deleteTrainConnectionById,
};