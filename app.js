import express from 'express';
import bodyparser from 'body-parser';
import * as z from 'zebras';
import get from 'lodash/get';
import jwt from 'jsonwebtoken';
import { secret } from './configs/configs';
import { getStationById, getAgeGroupsAtStationsToday, getLatestTripsEndedAtStationsToday } from './data/db';
import * as constants from './common/constants';

const app = express();
const ProtectedRoutes = express.Router();
const port = process.env.PORT || 3200;
const data = z.readCSV('data/Divvy_Trips_2019_Q2');

//set secret
app.set('Secret', secret);

// middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/', ProtectedRoutes);

// generate token whenever server starts up for time being...
const payload = {
  check:  true
};
const token = jwt.sign(payload, app.get('Secret'), {
  expiresIn: 1440 // expires in 24 hours
});

ProtectedRoutes.use((req, res, next) =>{
  const token = req.headers['access-token'];
  const secret = app.get('Secret');

  if (token) {
    jwt.verify(token, secret, (error, decoded) =>{
      if (error) {
        return res.status(401).send({
          errorMessage: constants.UNAUTHORIZED_ERROR_MESSAGE,
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).send({
      errorMessage: constants.UNAUTHORIZED_ERROR_MESSAGE,
    });

  }
});

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
ProtectedRoutes.get('/station/:id', async (req, res) => {
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
ProtectedRoutes.get('/age_groups', (req, res) => {
  const endStations = get(req, 'query["stations"]', '').split(',');
  const response = getAgeGroupsAtStationsToday(endStations, data);

  res.status(response.status).send(response.data);
});

/**
 * GET /trips_to_stations?stations={stationId1,stationId2,...}
 *
 * Given one or more stations,
 * return the last 20 trips that ended at each station for a single day.
 */
ProtectedRoutes.get('/trips_to_stations', (req, res) => {
  const endStations = get(req, 'query["stations"]', '').split(',');
  const response = getLatestTripsEndedAtStationsToday(endStations, data);

  res.status(response.status).send(response.data);
});

app.listen(port, () => {
  console.log(`running at port ${port}`);
  console.log('Generating Access Token');
  console.log();
  console.log(token);
});