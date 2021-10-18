import puppeteer from "puppeteer" ;
import { connect, disconnect} from "mongoose";
import { 
    getDbUrl, getHtmlWithPuppeteer, getScrapeUrl, extractDepartureAndDelay, getDepartureAndDelay 
} from "./scrape_functions";
import {trainConnection, } from "../models/trainConnections";

test("if db url can be retrieved", () => {
    expect(getDbUrl()).toBeTruthy();
});

describe("mongoDB", () => {
    beforeAll(async () => {
        await connect(getDbUrl(), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
    });

    afterAll(async () => {
        await disconnect();
    });

    test("if train connections can be retrieved", async () => {
        const trainConnections = await trainConnection.find();
        expect(trainConnection).toBeTruthy();
    });
})

describe("puppeteer", () => {
    const startStation  = "Horrem";
    const endStation    = "Aachen";
    const timeNow       = new Date();
    let browser: puppeteer.Browser;

    beforeAll(async () => {
        browser = await puppeteer.launch();
    });

    afterAll(async () => {
        browser.close();
    })

    test("if puppeteer navigates to website and returns html", async () => {
        let html = await getHtmlWithPuppeteer(
            getScrapeUrl(timeNow, startStation, endStation),
            browser
        );

        expect(html).toContain("Deutsche Bahn");
    });

    test("if departure and delay can be extracted", async () => {
        let html = await getHtmlWithPuppeteer(
            getScrapeUrl(timeNow, startStation, endStation),
            browser
        );

        const { departure, delay } = extractDepartureAndDelay(html);

        expect(departure).toContain(":");
        expect(delay).toContain(":");
    })

    test("if departure and delay are dates", async () => {
        let html = await getHtmlWithPuppeteer(
            getScrapeUrl(timeNow, startStation, endStation),
            browser
        );

        const { departure, delay } = getDepartureAndDelay(html);

        expect(departure).toBeInstanceOf(Date);
        expect(delay).toBeInstanceOf(Date);
    })
});