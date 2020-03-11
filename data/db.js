import axios from 'axios';
import find from 'lodash/find';

const BASE_URL = "https://gbfs.divvybikes.com/gbfs/en";
const LIST_STATIONS_URL = `${BASE_URL}/station_information.json`;

export const getStations = async () => {
  try {
    const isSuccess = true;
    const {
      status,
      data: {
        data: { stations }
      }
    } = await axios(LIST_STATIONS_URL);

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