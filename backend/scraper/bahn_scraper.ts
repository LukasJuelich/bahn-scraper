import puppeteer from "puppeteer";
import { isBefore, } from "date-fns";
import { connect, disconnect} from "mongoose";
import { timeRecord } from "../models/timeRecord";
import { trainConnection } from "../models/trainConnections";
import { getDbUrl, getDepartureAndDelay, getHtmlWithPuppeteer, getScrapeUrl} from "./scrape_functions";

const scrapeAndSaveToDb = async () => {
    const trainConnections = await trainConnection.find();
    const timeNow = new Date();

    let browser: puppeteer.Browser;
    browser = await puppeteer.launch();   //for Raspberry Pi {executablePath: '/usr/bin/chromium-browser'}
    
    await Promise.all(trainConnections.map(async (connection) => {
        const html: string = await getHtmlWithPuppeteer(
                                getScrapeUrl(
                                    timeNow,
                                    connection.startStation,
                                    connection.endStation
                                ),
                                browser
                            );

        const {departure, delay} = getDepartureAndDelay(html);

        const record = new timeRecord({
            timeOfScrape:   timeNow,
            startStation:   connection.startStation,
            endStation:     connection.endStation,
            departure:      departure,
            delay:          delay,
        });

        if(!isBefore(record.delay, record.departure)) {
            await record.save();
        }
    }))
    .then(() => {
        browser.close();
        disconnect();
    })
    .catch((err: Error) => {
        browser.close();
        disconnect();
        throw new Error(err.message);
    });
}

connect(getDbUrl(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        scrapeAndSaveToDb();
    })
    .catch((err: Error) => {
		throw new Error(err.message);
    });