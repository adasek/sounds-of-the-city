import * as THREE from "three";
import {EventDispatcher} from "three";
import {World} from "./World";
import {GeoObject} from "./GeoObject";

var GeoObjectFactory = function (controls, scene, domElement) {

    this.pointTables = {
        "pid_zastavky": {
            gfx: {
                geometry: {class: 'CylinderBufferGeometry', params: [0, 10, 30, 4, 1]},
                material: {class: 'MeshPhongMaterial', params: [{color: 0xff0000, flatShading: true}]}
            },
            audio: {src: 'sounds/213564__woodylein__at-a-bus-stop.mp3'}
        },
        "kultura_body": {
            gfx: {
                geometry: {class: 'CylinderBufferGeometry', params: [5, 10, 30, 5, 1]},
                material: {class: 'MeshPhongMaterial', params: [{color: 0xffffff, flatShading: true}]}
            }
        },
        "odpad_wc": {
            gfx: {
                geometry: {class: 'CylinderBufferGeometry', params: [5, 5, 30, 5, 1]},
                material: {class: 'MeshPhongMaterial', params: [{color: 0x666666, flatShading: true}]}
            }
        },
        "odpad_tridene_kontejnery": {
            gfx: {
                geometry: {class: 'CylinderBufferGeometry', params: [10, 10, 30, 5, 1]},
                material: {class: 'MeshPhongMaterial', params: [{color: 0x666666, flatShading: true}]}
            }
        },
        "odpad_sber": {
            gfx: {
                geometry: {class: 'CylinderBufferGeometry', params: [5, 10, 30, 5, 1]},
                material: {class: 'MeshPhongMaterial', params: [{color: 0x666666, flatShading: true}]}
            }
        },
        "policie": {
            gfx: {
                geometry: {class: 'CylinderBufferGeometry', params: [10, 5, 30, 10, 1]},
                material: {class: 'MeshPhongMaterial', params: [{color: 0x0000ff, flatShading: true}]}
            }
        },
        "priroda_pamatne_stromy": {
            gfx: {
                geometry: {class: 'CylinderBufferGeometry', params: [10, 5, 30, 12, 1]},
                material: {class: 'MeshPhongMaterial', params: [{color: 0x00ff00, flatShading: true}]}
            }
        }
    }


    this.build = function (geoItem, centerPoint, scene, audioCtx) {
        if (geoItem.tableName == 'technical_usage') {
            return null
        }

        let geoObject = new GeoObject(geoItem, this.pointTables[geoItem.table_name])
        geoObject.attachToScene(scene, centerPoint)
        geoObject.attachToAudioModel(audioCtx, centerPoint)
    }
}

export {GeoObjectFactory};

