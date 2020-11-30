/*
Component for communicating with server:
Acquiring geo features around given location
*/
import { EventDispatcher } from "three";

const tmp_area = require('../../../area.json')

var GeographyLoader = function ( lat, lon ) {
    this.lat = null
    this.lon = null
    this.geoData = {}

    this.calculateDistance = function(pointA, pointB){
        function deg2rad(deg) {
            return deg * (Math.PI/180)
        }

        var R = 6371;
            var dLat = deg2rad(pointB.lat-pointA.lat);
            var dLon = deg2rad(pointB.lon-pointA.lon);
            var a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(deg2rad(pointA.lat)) * Math.cos(deg2rad(pointB.lat)) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
            ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
            return d;
    }

    this.updateCoordinates = function(lat, lon){
        if (!this.lon || !this.lat || this.calculateDistance({lat: lat, lon: lon}, {lat: this.lat, lon: this.lon}) > 100){
            // fetch data
            this.geoData = tmp_area

            //todo: with callback
            setTimeout(function(){
                this.dispatchEvent( { type: 'geoDataLoaded', geoData: this.geoData } );
                this.lat = lat
                this.lon = lon
            }.bind(this),0)
        }
    }

    this.updateCoordinates(lat, lon)

};

GeographyLoader.prototype = Object.create( EventDispatcher.prototype );
GeographyLoader.prototype.constructor = GeographyLoader;

export { GeographyLoader };
