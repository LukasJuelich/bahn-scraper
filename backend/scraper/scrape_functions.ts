import dotenv from "dotenv";
import { format, } from "date-fns";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";


const getDbUrl = (): string => {
    dotenv.config({path: "./config/.env"});
    if(process.env.DB_URL)
        return process.env.DB_URL;
    else
        throw new Error("No database URL!");
}

const getScrapeUrl = (timeNow: Date, startStation: string, endStation: string): string => {
    const date = format(timeNow, 'dd.MM.yyyy');
    const time = format(timeNow, 'HH:mm');

    let url = `https://reiseauskunft.bahn.de/bin/query.exe/dn?&start=1\
&S=${startStation}&Z=${endStation}&date=${date}&time=${time}`

    return url;
}

const getHtmlWithPuppeteer = async (url: string, browser: puppeteer.Browser) => {
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

const extractDepartureAndDelay = (html: string): { departure:string , delay:string } => {
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

    return {
        departure: departure,
        delay: delay,
    }
}

const getDepartureAndDelay = (html: string) => {
    const {departure, delay } = extractDepartureAndDelay(html);

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


export { 
    getDbUrl, 
    getScrapeUrl, 
    getHtmlWithPuppeteer, 
    extractDepartureAndDelay, 
    getDepartureAndDelay 
};