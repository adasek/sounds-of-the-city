# Sounds of Prague
## Project
This is a work for [NI-CCC course](https://ni-ccc.github.io/) at Faculty of Information Technology of Czech Technical University in Prague created by Adam Benda and Radka Hošková.

## Concept
We want to build audio model of Prague based on spatial opendata. It would allow user to take a walk through the city and listen to various sounds emmited in the city.
For more info see [https://ni-ccc.github.io/projects/zvuky_mesta.html](concept document in czech).

## Technology
### Frontend
HTML5+javascript application utilizing spatialization functions of WebAudioAPI. It's tested on latest desktop Google Chrome. Unfortunately this application is not currently working in Firefox.

We use [THREE.js](https://threejs.org) library for visualisation. App is built using webpack.

### Backend
Thin javascript server (run in Nodejs) that provides client nescessary files to run the frontend and allows to query the postgres database.

### Database
Postgresql with PostGIS extension allows server to search for features around Client avatar effectively.

## Demo
Current version should be available at [http://zvukymesta.m42.cz](http://zvukymesta.m42.cz)

## Install & development
See [INSTALL.md](INSTALL.md) instructions




