const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const moment = require("moment");
const MongoClient = require('mongodb').MongoClient;

var dbURL = "mongodb://localhost:27017/mydb";

MongoClient.connect(dbURL, {useUnifiedTopology: true}, function(err, db) {
    if(err) throw err;
    var dbo = db.db("mydb");

    dbo.createCollection("times", function(err, res) {
        if(err) throw err;
        console.log("DB connection established!");

        moment.locale("de");
        var url = "https://reiseauskunft.bahn.de/bin/query.exe/dn?revia=yes&existOptimizePrice=1&country=DEU&dbkanal_007=L01_S01_D001_KIN0001_qf-bahn-svb-kl2_lz03&start=1&protocol=https%3A&REQ0JourneyStopsS0A=1&S=Horrem+Bahnhof%2C+Kerpen+(Rheinland)&REQ0JourneyStopsSID=A%3D1%40O%3DHorrem+Bahnhof%2C+Kerpen+(Rheinland)%40X%3D6713621%40Y%3D50915801%40U%3D80%40L%3D000443575%40B%3D1%40p%3D1556573609%40&Z=Aachen+Hbf&REQ0JourneyStopsZID=&date=Mo%2C"
        + moment().format("D.M.Y") + "&time=" + moment().format("LT") + "&timesel=depart&returnDate=&returnTime=&returnTimesel=depart&optimize=0&auskunft_travelers_number=1&tariffTravellerType.1=E&tariffTravellerReductionClass.1=0&tariffClass=2&rtMode=DB-HYBRID&externRequest=yes&HWAI=JS!js%3Dyes!ajax%3Dyes!";
        console.log(url);

        (async () =>{
            try{
                const browser = await puppeteer.launch();   //for Raspberry Pi {executablePath: '/usr/bin/chromium-browser'}
                const page = await browser.newPage();
                await page.goto(url);
                var html = await page.content();
                await browser.close();
            }
            catch(err) {
                console.log("Error in puppeteer: " + err);
                db.close();
                console.log("DB connection closed!");
            }

            var $ = cheerio.load(html);

            var time = $(".time").eq(1)[0];
            var plannedDeparture = time.firstChild.nodeValue;
            var delay = time.firstChild.nextSibling.lastChild.nodeValue;

            console.log(plannedDeparture + "\n" + delay);

            var dbEntry = { abfrage: moment().format("LLLL"),
                            abfahrt: plannedDeparture,
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
