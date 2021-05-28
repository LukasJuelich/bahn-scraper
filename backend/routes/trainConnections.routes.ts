import * as express from "express";
import { createTrainConnection, findTrainConnectionById, findTrainConnectionsByFilter, deleteTrainConnectionById } from "../controllers/trainConnections.controller";

let crudTrainConnection = express.Router();

crudTrainConnection.post("/:startStation/:endStation", createTrainConnection);

crudTrainConnection.get("/:id", findTrainConnectionById);

crudTrainConnection.get("/", findTrainConnectionsByFilter);

crudTrainConnection.delete("/:id", deleteTrainConnectionById);

export {
    crudTrainConnection
};