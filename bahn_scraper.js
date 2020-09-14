const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const moment = require("moment");
const MongoClient = require('mongodb').MongoClient;

const dbURL = "mongodb://localhost:27017";
const dbName = "mydb";
const startStation = "horrem";
const endStation ="Aachen";

moment.locale("de");

const url = "https://reiseauskunft.bahn.de/bin/query.exe/dn?&start=1"
            + "&S=" + startStation
            + "&Z=" + endStation
            + "&date=" + moment().format("D.M.Y")
            + "&time=" + moment().format("LT");
console.log(url);
            
const getHtmlWithPuppeteer = async (url) => {
    let browser;
    let html;
    try{
        browser = await puppeteer.launch();   //for Raspberry Pi {executablePath: '/usr/bin/chromium-browser'}
        const page = await browser.newPage();
        await page.goto(url);
        html = await page.content();
        await browser.close();
    }
    catch(err) {
        await browser.close();
        throw "Error in puppeteer: " + err;
    }

    if(html == null) {
        throw "ERROR: html is " + html;
    }

    return html;
};

const getDepartureAndDelay = (html) => {
    const $ = cheerio.load(html);

    const time = $(".time").eq(1)[0];
    const departure = time.firstChild.nodeValue;
    const delay = time.firstChild.nextSibling.lastChild.nodeValue;

    if(departure == null || delay == null){
        throw "ERROR: departure is "+departure+", delay is "+delay;
    }
    console.log(departure + "\n" + delay);

    return {
        departure: departure,
        delay: delay,
    };
}

const client = new MongoClient(dbURL, {useUnifiedTopology: true});

client.connect((err) => {
    if(err) throw err;
    console.log('DB connection established!');
    const db = client.db(dbName);

    db.createCollection("times", (err, res) => {
        if (err) return;
    });

    (async () => {
        const html = await getHtmlWithPuppeteer(url);
        const {departure, delay} = getDepartureAndDelay(html);
        const dbEntry = {
            abfrage: moment().format('LLLL'),
            abfahrt: departure,
            verspaetung: delay,
        };

        db.collection("times").insertOne(dbEntry, (err, res) => {
            if (err) throw err;
            console.log("1 document inserted!");
        });
        
        client.close();
    })();
});