import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { connect, disconnect} from "mongoose";
import { timeRecord } from "./models/timeRecord";
import { trainConnection } from "./models/trainConnections";
import dotenv from "dotenv";
import { format } from "date-fns";

dotenv.config({path: "./config/.env"});
const dbUrl: any = process.env.DB_URL;

const timeNow = new Date();

const getScrapeUrl = (startStation: string, endStation: string): string => {
    const date = format(timeNow, 'dd.MM.yyyy');
    const time = format(timeNow, 'HH:mm');

    let url = `https://reiseauskunft.bahn.de/bin/query.exe/dn?&start=1\
&S=${startStation}&Z=${endStation}&date=${date}&time=${time}`

    // console.log(url);
    return url;
}

const getHtmlWithPuppeteer = async (url: string) => {
    let browser: puppeteer.Browser | undefined;
    let html: string;
    try{
        browser = await puppeteer.launch();   //for Raspberry Pi {executablePath: '/usr/bin/chromium-browser'}
        const page: puppeteer.Page = await browser.newPage();
        await page.goto(url);
        html = await page.content();
        await browser.close();
    }
    catch(err) {
        if(browser)
            await browser.close();
        throw new Error("Error in puppeteer: " + err);
    }

    if(!html) {
        throw new Error("ERROR: html is " + html);
    }

    return html;
};

const getDepartureAndDelay = (html: string) => {
    const $: cheerio.Root = cheerio.load(html);

    const time: any = $(".time").eq(1)[0];
    const departure: string = time.firstChild.nodeValue;
    let delay: string = departure;

    if(!departure) {
        throw new Error(`ERROR: departure is ${departure}, delay is ${delay}`);
    }
    if( time.firstChild.nextSibling && time.firstChild.nextSibling.lastChild.nodeValue ) {
        delay = time.firstChild.nextSibling.lastChild.nodeValue;
    }

    let departureDate = new Date();
    departureDate.setHours(
        Number(departure.split(":")[0]), 
        Number(departure.split(":")[1]),
        0, 
        0
    );

    let delayDate = new Date();
    delayDate.setHours(
        Number(delay.split(":")[0]), 
        Number(delay.split(":")[1]),
        0, 
        0
    );

    return {
        departure: departureDate,
        delay: delayDate,
    };
};

connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        (async() => {
            const trainConnections = await trainConnection.find();

            await Promise.all(trainConnections.map(async (connection) => {
                const html: string = await getHtmlWithPuppeteer(
                                        getScrapeUrl(
                                            connection.startStation,
                                            connection.endStation
                                        )
                                    );

                const {departure, delay} = getDepartureAndDelay(html);

                const record = new timeRecord({
                    timeOfScrape:   timeNow,
                    startStation:   connection.startStation,
                    endStation:     connection.endStation,
                    departure:      departure,
                    delay:          delay,
                });

                await record.save();
            }))
            .then(() => {
                disconnect();
            })
            .catch((err: Error) => {
                throw new Error(err.message);
            });
        })();
    })
    .catch((err: Error) => {
		throw new Error(err.message);
    });

module.exports = { getHtmlWithPuppeteer, getDepartureAndDelay };