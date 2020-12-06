import * as THREE from "three";
import {EventDispatcher} from "three";
import {World} from "./World";
import {GeoObject} from "./GeoObject";

const axios = require('axios').default;


var GeoObjectFactory = function (controls, scene, domElement) {
    this.pointTable = null
    axios.get('/data_sources.json', {})
        .then(function (response) {
            this.pointTable = {}
            for (const dataSource of response.data) {
                this.pointTable[dataSource.table_name] = dataSource
            }
        }.bind(this))
        .catch(function (error) {
            console.error(error);
            throw error
        });

    this.build = function (geoItem, centerPoint, scene, audioCtx) {
        if (!this.pointTable || !(geoItem.table_name in this.pointTable)) {
            return null
        }

        let geoObject = new GeoObject(geoItem, this.pointTable[geoItem.table_name])
        geoObject.attachToScene(scene, centerPoint)
        geoObject.attachToAudioModel(audioCtx, centerPoint)
        return geoObject
    }
}

export {GeoObjectFactory};

