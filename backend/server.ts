import express from "express";
import { Request, Response, } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connect } from "mongoose";
import { crudTimeRecords } from "./routes/timeRecords.routes";
import { crudTrainConnection } from "./routes/trainConnections.routes";
import dotenv from "dotenv"

dotenv.config({path: "./config/.env"});
const corsOrigin: any = process.env.CORS_ORIGIN;
const dbUrl: any = process.env.DB_URL;
if(!corsOrigin || !dbUrl) {
	throw new Error("Variables undefined in .env!");
}

const app = express();

app.use(cors(corsOrigin));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connect(dbUrl, {
		useNewUrlParser: true,
    	useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to database!");
	})
	.catch(err => {
		throw new Error("Connecting to database failed!" + err);
	})

	app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to backend" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

app.use('/records/', crudTimeRecords);
app.use('/trainconnections/', crudTrainConnection);