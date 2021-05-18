import * as express from "express";
import { createRecord, findRecordById, findAllRecords, deleteRecordById, findRecords } from "../controllers/timeRecords.controller";

let crudRoutes = express.Router();

crudRoutes.post("/", createRecord);

crudRoutes.get("/:id", findRecordById);

crudRoutes.get("/", findRecords);

crudRoutes.delete("/:id", deleteRecordById);

export {
    crudRoutes
};