import * as express from "express";
import { Request, Response, } from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { connect } from "mongoose"
import { dbUrl } from "./config/db.config"
import { crudRoutes } from "./routes/timeRecords.routes";

const app = express();

let corsOptions: cors.CorsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
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
		console.log("Connecting to database failed!", err);
		process.exit(1);
	})

	app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to backend" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

app.use('/api/record', crudRoutes);