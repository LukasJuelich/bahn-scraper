import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { connect, disconnect} from "mongoose";
import { timeRecord } from "./models/timeRecord";
import { trainConnection } from "./models/trainConnections";
import dotenv from "dotenv";
import { format, isBefore, } from "date-fns";

dotenv.config({path: "./config/.env"});
const dbUrl: any = process.env.DB_URL;

const timeNow = new Date();
let browser: puppeteer.Browser;

const getScrapeUrl = (startStation: string, endStation: string): string => {
    const date = format(timeNow, 'dd.MM.yyyy');
    const time = format(timeNow, 'HH:mm');

    let url = `https://reiseauskunft.bahn.de/bin/query.exe/dn?&start=1\
&S=${startStation}&Z=${endStation}&date=${date}&time=${time}`

    return url;
}

const getHtmlWithPuppeteer = async (url: string) => {
    let html: string;
    let page: puppeteer.Page;

    page = await browser.newPage();
    await page.setDefaultNavigationTimeout(180000);

    try{
        await page.goto(url);
        html = await page.content();
        await page.close();
    }
    catch(err) {
        if(page)
            await page.close();
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
        useCreateIndex: true,
    })
    .then(() => {
        (async() => {
            const trainConnections = await trainConnection.find();
            browser = await puppeteer.launch();   //for Raspberry Pi {executablePath: '/usr/bin/chromium-browser'}
            
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
        })();
    })
    .catch((err: Error) => {
		throw new Error(err.message);
    });

module.exports = { getHtmlWithPuppeteer, getDepartureAndDelay };