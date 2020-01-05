const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const moment = require("moment");
const MongoClient = require('mongodb').MongoClient;

const dbURL = "mongodb://localhost:27017/mydb";
const startStation = "horrem";
const endStation ="Aachen";

moment.locale("de");
var url = "https://reiseauskunft.bahn.de/bin/query.exe/dn?&start=1"
            + "&S=" + startStation
            + "&Z=" + endStation
            + "&date=" + moment().format("D.M.Y")
            + "&time=" + moment().format("LT");
console.log(url);

const getHtmlWithPuppeteer = async (url) => {
    var html;
    
    try{
        const browser = await puppeteer.launch({headless: false});   //for Raspberry Pi {executablePath: '/usr/bin/chromium-browser'}
        const page = await browser.newPage();
        await page.goto(url);
        html = await page.content();
        await browser.close();
    }
    catch(err) {
        console.log("Error in puppeteer: " + err);
    }

    return html;
};

const getDepartureAndDelay = (html) => {
    var $ = cheerio.load(html);

    var time = $(".time").eq(1)[0];
    var departure = time.firstChild.nodeValue;
    var delay = time.firstChild.nextSibling.lastChild.nodeValue;

    console.log(departure + "\n" + delay);

    return [departure, delay];
}

MongoClient.connect(dbURL, {useUnifiedTopology: true}, function(err, db) {
    if(err) throw err;
    var dbo = db.db("mydb");

    dbo.createCollection("times", function(err, res) {
        (async ()=> {
            if(err) throw err;
            console.log("DB connection established!");

            let html = await getHtmlWithPuppeteer(url);
            let departureAndDelay = getDepartureAndDelay(html);

            let departure = departureAndDelay[0];
            let delay = departureAndDelay[1];

            var dbEntry = { abfrage: moment().format("LLLL"),
                            abfahrt: departure,
                            verspaetung: delay};
            dbo.collection("times").insertOne(dbEntry, function(err, res) {
                if(err) throw err;
                console.log("1 document inserted!");
                db.close();
                console.log("DB connection closed!");
            });
        })();
    });
});