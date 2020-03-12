import axios from 'axios';
import find from 'lodash/find';
import includes from 'lodash/includes';
import * as helpers from '../common/helpers';
import * as constants from '../common/constants';

export const getStations = async () => {
  try {
    const isSuccess = true;
    const {
      status,
      data: {
        data: { stations }
      }
    } = await axios(constants.LIST_STATIONS_URL);

    return {
      isSuccess,
      status,
      data: stations,
    };

  } catch (error) {
    const isSuccess = false;

    return {
      isSuccess,
      status: error.response.status,
      data: {
        errorMessage: error.response.statusText,
      },
    };
  }
}

export const getStationById = async (id) => {
    const response = await getStations();

    if (response.isSuccess) {
      const stations = response.data;
      response.data = find(stations, {'station_id': id});
    }

    return response;
}

export const getAgeGroupsAtStationsToday = (stations, dataSet) => {
  try {
    const isSuccess = true;
    const status = 200;

    let age0To20 = 0;
    let age21To30 = 0;
    let age31To40 = 0;
    let age41To50 = 0;
    let age51Over = 0;
    let ageUnknown = 0;

    if (stations.length > 0) {
      const tripsEndAtStationsToday = dataSet.filter((row) => includes(stations, row[constants.END_STATION_ID]) && helpers.isToday(row[constants.LOCAL_END_TIME]));

      tripsEndAtStationsToday.forEach((data) => {
        const birthYear = data[constants.BIRTH_YEAR];
        const age = helpers.getAgeByBirthYear(birthYear);
        if (!age) {
          ageUnknown++;
        } else if (age >= 51) {
          age51Over++;
        } else if (age >= 41 && age <= 50) {
          age41To50++;
        } else if (age >= 31 && age <= 40) {
          age31To40++;
        } else if (age >= 21 && age <= 30) {
          age21To30++;
        } else if (age >= 0 && age <= 20) {
          age0To20++;
        }
      });
    }

    const data = [age0To20, age21To30, age31To40, age41To50, age51Over, ageUnknown];

    return {
      isSuccess,
      status,
      data,
    };
  } catch (error) {
    const isSuccess = false;

    return {
      isSuccess,
      status: 500,
      data: {
        errorMessage: constants.INTERNAL_SERVER_ERROR_MESSAGE,
      },
    };
  }
}