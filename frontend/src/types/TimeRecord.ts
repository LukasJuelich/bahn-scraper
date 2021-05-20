interface TimeRecord {
    id:             number;
    timeOfScrape:	Date;
    startStation:   string;
    endStation:     string;
    departure:		Date;
    delay:			Date;
}

export { TimeRecord };