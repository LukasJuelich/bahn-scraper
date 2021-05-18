import * as puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { connect, disconnect} from "mongoose";
import { dbUrl } from "./config/db.config";
import { timeRecord } from "./models/timeRecord"

const startStation: string = "Horrem";
const endStation: string ="Aachen";

const timeNow = new Date();

const date =    ((timeNow.getDate() < 10)? "0":"") + timeNow.getDate()+ "." + 
                ((timeNow.getMonth()+1 < 10)? "0":"") + (timeNow.getMonth() + 1)+ "." + 
                timeNow.getFullYear();
const time =    ((timeNow.getHours() < 10)? "0":"") + timeNow.getHours()+ ":" + 
                ((timeNow.getMinutes() < 10)? "0":"") + timeNow.getMinutes();

const url: string = "https://reiseauskunft.bahn.de/bin/query.exe/dn?&start=1"
            + "&S=" + startStation
            + "&Z=" + endStation
            + "&date=" + date
            + "&time=" + time;

console.log(url);

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
        throw "Error in puppeteer: " + err;
    }

    if(html == null) {
        throw "ERROR: html is " + html;
    }

    return html;
};

const getDepartureAndDelay = (html: string) => {
    const $: cheerio.Root = cheerio.load(html);

    const time: any = $(".time").eq(1)[0];
    const departure: string = time.firstChild.nodeValue;
    const delay: string = time.firstChild.nextSibling.lastChild.nodeValue;

    if(departure == null || delay == null){
        throw "ERROR: departure is "+departure+", delay is "+delay;
    }

    const departureDate = new Date();
    departureDate.setHours(
        Number(departure.split(":")[0]), 
        Number(departure.split(":")[1]),
        0, 
        0
    );

    const delayDate = new Date();
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
            const html: string = await getHtmlWithPuppeteer(url);
            const {departure, delay} = getDepartureAndDelay(html);
            console.log(timeNow + "\n" + departure + "\n" + delay + "\n");

            const record = new timeRecord({
                timeOfScrape:   timeNow,
                startStation:   startStation,
                endStation:     endStation,
                departure:      departure,
                delay:          delay,
            })
            record.save(err => {
                if(err) {
                    throw err;
                }
                else {
                    console.log("Saved to db!!");
                }
                disconnect();
            })
        })()
    })
    .catch(err => {
		console.log(err);
    })

module.exports = { getHtmlWithPuppeteer, getDepartureAndDelay };