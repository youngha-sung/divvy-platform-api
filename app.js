import express from 'express';
import bodyparser from 'body-parser';
import * as z from 'zebras';
import get from 'lodash/get';
import { getStationById, getAgeGroupsAtStationsToday } from './data/db';

const app = express();
const port = process.env.PORT || 3200;

// middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const data = z.readCSV('data/Divvy_Trips_2019_Q2')

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
 * GET /station/{id}
 *
 * Given a station id,
 * return the information for one station
 */
app.get('/station/:id', async (req, res) => {
  const station_id = req.params.id;
  const response = await getStationById(station_id);

  res.status(response.status).send(response.data);
});

/**
 * GET /age_groups?stations={stationId1,stationId2,...}
 *
 * Given one or more stations,
 * return the number of riders in the following age groups,
 * [0-20,21-30,31-40,41-50,51+, unknown],
 * who ended their trip at that station for a given day.
 */
app.get('/age_groups', (req, res) => {
  const endStations = get(req, 'query["stations"]', '').split(',');
  const response = getAgeGroupsAtStationsToday(endStations, data);

  res.status(response.status).send(response.data);
});

/**
 * Given one or more stations,
 * return the last 20 trips that ended at each station for a single day.
 */
app.get('/trips', (req, res) => {
  res.status(200).send(stations);
});

app.listen(port, () => {
  console.log(`running at port ${port}`);
});