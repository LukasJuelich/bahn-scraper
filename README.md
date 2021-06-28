# bahn-scraper
Project to learn web scraping with **Node.js**, **Puppeteer**, **cheerio** and **mongoDB**.

Scraping script(in backend/bahn_scraper.ts) is supposed to be scheduled with crontab.
Currently executes every 5 minutes and queries [bahn.de](https://reiseauskunft.bahn.de) for every trainconnection pair saved in the mongoDB. Also runs great on a Raspberry Pi!

# Frontend
Live Version at https://icy-hill-07a88c603.azurestaticapps.net

Built with Vue.js, tailwindcss

Might take ~30sec for data to load on the first connection since backend-server is not always online(on demand)

# Backend: 
Live Version: https://bahnscraper.azurewebsites.net

Built with Node.js, Express, mongoDB
## example get requests:
Might take ~30sec for data to load on the first connection since backend-server is not always online(on demand)

* get all train connections
`https://bahnscraper.azurewebsites.net/trainconnections`

* get all records from connection Horrem/Aachen
`https://bahnscraper.azurewebsites.net/records/Horrem/Aachen`

* get by startDate and endDate
`https://bahnscraper.azurewebsites.net/records/Horrem/Aachen?startDate=06.10.2021&endDate=06.12.2021`

* get by startDate
`https://bahnscraper.azurewebsites.net/records/Horrem/Aachen?startDate=06.10.2021`

* get by endDate
`https://bahnscraper.azurewebsites.net/records/Horrem/Aachen?endDate=06.12.2021`