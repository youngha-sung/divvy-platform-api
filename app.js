const express = require("express");
const bodyparser = require("body-parser");

const app = express();
const port = process.env.PORT || 3200;

const stations = [];

// middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

/**
 * DEFINITIONS:
 * Station - Where the bikes can originate and end
 * Trip - the dates, times, station, and rider info
 * Rider - the person renting the bike
 *
 * DATA SOURCES:
 * Station Information - https://gbfs.divvybikes.com/gbfs/en/station_information.json
 *
 *
 * REQUIREMENTS:
 * 1. Every API request to include an API token and handle the case where this is missing.
 * 2. Test for at least one of the api calls.
 * 3. Containerize so it can be deployed using Docker.
 * 4. README that has information about how to access the API
 endpoints.
 */

/**
 * Given a station id,
 * return the information for one station
 */
app.get("/station", (req, res) => {
  res.status(200).send(stations);
});

/**
 * Given one or more stations,
 * return the number of riders in the following age groups,
 * [0-20,21-30,31-40,41-50,51+, unknown],
 * who ended their trip at that station for a given day.
 */
app.get("/riders", (req, res) => {
  res.status(200).send(stations);
});

/**
 * Given one or more stations,
 * return the last 20 trips that ended at each station for a single day.
 */
app.get("/trips", (req, res) => {
  res.status(200).send(stations);
});

app.listen(port, () => {
  console.log(`running at${port}`);
});