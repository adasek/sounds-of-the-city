import {
    EventDispatcher,
    Vector3
} from "three";
import {Avatar} from '../avatar/Avatar.js';


import * as THREE from "three";

var World = function (controls, scene, domElement) {
    this.controls = controls
    this.scene = scene
    this.avatar = new Avatar(scene, domElement)
    this.objects = []
    this.center = {lat: 50.092656, lon: 14.3225442}

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.listener = this.audioCtx.listener;

    // Audio
    const pannerModel = 'HRTF';
    const innerCone = 360;
    const outerCone = 360;
    const outerGain = 0.3;
    const distanceModel = 'linear';
    const maxDistance = 10000;
    const refDistance = 1;
    const rollOff = 10;

    this.pointTables = {
        "pid_stops": {
            table: "pid_stops",
            geometry: new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1),
            material: new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true}),
            soundSrc: 'sounds/213564__woodylein__at-a-bus-stop.mp3'
        },
        "culture_venues": {
            table: "culture_venues",
            geometry: new THREE.CylinderBufferGeometry(5, 10, 30, 5, 1),
            material: new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true})
        },
        "trash_wc": {
            table: "trash_wc",
            geometry: new THREE.CylinderBufferGeometry(5, 5, 30, 5, 1),
            material: new THREE.MeshPhongMaterial({color: 0x666666, flatShading: true})
        },
        "trash_containers": {
            table: "trash_containers",
            geometry: new THREE.CylinderBufferGeometry(10, 10, 30, 5, 1),
            material: new THREE.MeshPhongMaterial({color: 0x666666, flatShading: true})
        },
        "trash_centers": {
            table: "trash_centers",
            geometry: new THREE.CylinderBufferGeometry(5, 10, 30, 5, 1),
            material: new THREE.MeshPhongMaterial({color: 0x666666, flatShading: true})
        },
        "police": {
            table: "police",
            geometry: new THREE.CylinderBufferGeometry(10, 5, 30, 10, 1),
            material: new THREE.MeshPhongMaterial({color: 0x0000ff, flatShading: true})
        },
        "nature_memorial_trees": {
            table: "nature_memorial_trees",
            geometry: new THREE.CylinderBufferGeometry(10, 5, 30, 12, 1),
            material: new THREE.MeshPhongMaterial({color: 0x00ff00, flatShading: true})
        }
    }

    this.parseGeometry = function (geometry) {
        //input: POINT(14.322079278 50.0925608060001)
        let pos = geometry.match(/POINT\(([0-9.]*) ([0-9.]*)/i);
        return {lon: parseFloat(pos[1]), lat: parseFloat(pos[2])}
    }

    this.updateGeoData = function (geoData) {
        // load new objects
        for (let objectType in geoData) {
            //geoData[objectType]
            if (!this.pointTables[objectType]) {
                continue
            }
            let pointTable = this.pointTables[objectType]

            geoData[objectType].forEach((geoItem) => {
                    const mesh = new THREE.Mesh(pointTable.geometry, pointTable.material);
                    let point = this.parseGeometry(geoItem.geometry)
                    mesh.position.x = (point.lat - this.center.lat) * 100000;
                    mesh.position.y = 0;
                    mesh.position.z = (point.lon - this.center.lon) * 100000;
                    mesh.updateMatrix();
                    mesh.matrixAutoUpdate = false;
                    this.scene.add(mesh);


                    const panner = new PannerNode(this.audioCtx, {
                        panningModel: pannerModel,
                        distanceModel: distanceModel,
                        positionX: mesh.position.x,
                        positionY: mesh.position.y,
                        positionZ: mesh.position.z,
                        orientationX: 0,
                        orientationY: 1,
                        orientationZ: 0,
                        refDistance: refDistance,
                        maxDistance: maxDistance,
                        rolloffFactor: rollOff,
                        coneInnerAngle: innerCone,
                        coneOuterAngle: outerCone,
                        coneOuterGain: outerGain
                    })
                    if (pointTable.soundSrc) {
                        const audioElement = document.createElement('audio')
                        audioElement.src = pointTable.soundSrc
                        audioElement.play()
                        const track = this.audioCtx.createMediaElementSource(audioElement);
                        track.connect(panner).connect(this.audioCtx.destination);
                    }
                    this.objects.push({
                        mesh: mesh,
                        panner: panner
                    })
                }
            )
        }
    }

    this.update = function () {
        return function update(timeElapsed) {

            let positionDiff = this.avatar.update(timeElapsed);

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
