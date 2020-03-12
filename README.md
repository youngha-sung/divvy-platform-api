# divvy-platform-api

## How to run the app
1. Clone this repo to your local machine
2. Download and unzip the data file (https://s3.amazonaws.com/divvy-data/tripdata/Divvy_Trips_2019_Q2.zip) and place it in /data directory
3. In the terminal, cd into the local repository
4. run following commands

```
npm i && npm run start
``` 

Application will provide you the Access Token

## Endpoints

All endpoints requires access token to be passed in the header
```
access-token: <access-token-generated-when-server-starts>
``` 


```
GET /station/{id}
```

Given a station id, returns the information for one station

```
GET /age_groups?stations={stationId1,stationId2,...}
```
Given one or more stations, returns the number of riders in the following age groups, [0-20,21-30,31-40,41-50,51+, unknown], who ended their trip at that station for a given day.

```
GET /trips_to_stations?stations={stationId1,stationId2,...}
```
Given one or more stations, returns the last 20 trips that ended at each station for a single day.