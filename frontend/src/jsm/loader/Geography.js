/*
Component for communicating with server:
Acquiring geo features around given location
*/
import { EventDispatcher } from "three";
import { GeographyHelper } from "../helper/Geography.js";
import  * as config from '/config.json'
const axios = require('axios').default;

var GeographyLoader = function ( lat, lon ) {
    this.lat = null
    this.lon = null
    this.geoData = {}
    this.isUpdating = false

    this.updateCoordinates = function(lat, lon){
        if (!this.isUpdating && (!this.lon || !this.lat || GeographyHelper.calculateDistance({lat: lat, lon: lon}, {lat: this.lat, lon: this.lon}) > 0.1)){
            // fetch data
            this.isUpdating = true
            let requestData = {
                longitude: lon,
                latitude: lat
            }

            axios.post(config.BACKEND_URL, requestData)
                .then(function (response) {
                    if(response.data.error){ throw response.data.error }
                    this.geoData = response.data
                    this.dispatchEvent( { type: 'geoDataLoaded', geoData: this.geoData, center: {lat: lat, lon: lon} } );
                    this.lat = lat
                    this.lon = lon
                    this.isUpdating = false
                }.bind(this))
                .catch(function (error) {
                    this.isUpdating = false
                    console.log(error);
                }.bind(this));
        }
    }

    this.updateCoordinates(lat, lon)

};

GeographyLoader.prototype = Object.create( EventDispatcher.prototype );
GeographyLoader.prototype.constructor = GeographyLoader;

export { GeographyLoader };
