import * as express from "express";
import { createRecord, findRecordById, findAllRecords, deleteRecordById, findRecords } from "../controllers/timeRecords.controller";

let crudTimeRecords = express.Router();

// crudTimeRecords.post("/", createRecord);

crudTimeRecords.get("/:id", findRecordById);

crudTimeRecords.get("/:startStation/:endStation", findRecords);

crudTimeRecords.delete("/:id", deleteRecordById);

export {
    crudTimeRecords
};