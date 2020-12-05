import {
    EventDispatcher,
    Vector3
} from "three";
import {Avatar} from '../avatar/Avatar.js';
import {GeoObjectFactory} from './GeoObjectFactory.js';

import * as THREE from "three";

var World = function (controls, scene, domElement) {
    this.controls = controls
    this.scene = scene
    this.avatar = new Avatar(scene, domElement)
    this.objects = {}
    this.center = {lat: null, lon: null}
    this.geoObjectFactory = new GeoObjectFactory()

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.listener = this.audioCtx.listener;

    this.updateGeoData = function (geoData, centerPoint) {
        this.center.lat = centerPoint.lat
        this.center.lon = centerPoint.lon
        // update avatar position
        this.avatar.object.position.x = 0
        this.avatar.object.position.y = 0
        this.avatar.object.position.z = 0
        //delete objects
        this.audioCtx.close();
        this.audioCtx = new AudioContext();
        this.listener = this.audioCtx.listener;

        // load new objects
        for (let objectType in geoData) {
            //geoData[objectType]
            if (!Array.isArray(geoData[objectType])) {
                continue;
            }
            for (let geoItem of geoData[objectType]) {
                let newObject = this.geoObjectFactory.build(geoItem, this.center, this.scene, this.audioCtx)
                if (!newObject) {
                    continue;
                }
                if (newObject.hash() in this.objects) {
                    throw "Duplicate object hash " + newObject.hash()
                }
                this.objects[newObject.hash()] = newObject
            }
        }
    }

    this.update = function () {
        return function update(timeElapsed) {
            let positionDiff = this.avatar.update(timeElapsed);

            this.dispatchEvent({type: 'positionUpdate', position: this.avatar.getGPSPosition(this.center)});


            this.controls.target.x = this.avatar.object.position.x
            this.controls.target.y = this.avatar.object.position.y
            this.controls.target.z = this.avatar.object.position.z

            this.controls.object.position.x -= positionDiff.x
            this.controls.object.position.y -= positionDiff.y
            this.controls.object.position.z -= positionDiff.z

            //audio
            this.listener.positionX.value = this.avatar.object.position.x;
            this.listener.positionY.value = this.avatar.object.position.y;
            this.listener.positionZ.value = this.avatar.object.position.z;

            this.listener.forwardX.value = this.avatar.forwardVector.x;
            this.listener.forwardY.value = this.avatar.forwardVector.y;
            this.listener.forwardZ.value = this.avatar.forwardVector.z;
            this.listener.upX.value = this.avatar.up.x;
            this.listener.upY.value = this.avatar.up.y;
            this.listener.upZ.value = this.avatar.up.z;
        };
    }();


    var scope = this;

    this.update();

};

World.prototype = Object.create(EventDispatcher.prototype);
World.prototype.constructor = World;


export {World};
