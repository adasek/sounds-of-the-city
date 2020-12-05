import * as THREE from "three";
import * as merge from 'deepmerge';
import {CylinderBufferGeometry, MeshPhongMaterial} from 'three';


var GeoObject = function (geoItem, opts) {
    this.geoItem = geoItem

    const geometryClasses = {
        CylinderBufferGeometry
    };
    const materialClasses = {
        MeshPhongMaterial
    };
    const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray

    // Default values
    this.opts = {
        audio: {
            'pannerModel': 'HRTF',
            'innerCone ': 360,
            'outerCone': 360,
            'outerGain': 0.3,
            'distanceModel': 'linear',
            'maxDistance': 10000,
            'refDistance': 1,
            'rollOff': 10,
        },
        gfx: {
            geometry: {class: 'CylinderBufferGeometry', params: [5, 5, 30, 5, 1]},
            material: {class: 'MeshPhongMaterial', params: [{color: 0x666666, flatShading: true}]}
        }
    }
    this.opts = merge(this.opts, opts, { arrayMerge: overwriteMerge })

    this.parseGeometry = function (geometry) {
        //input: POINT(14.322079278 50.0925608060001)
        let pos = geometry.match(/POINT\(([0-9.]*) ([0-9.]*)/i);
        return {lon: parseFloat(pos[1]), lat: parseFloat(pos[2])}
    }
    this.geometryCenter = function () {
        return this.parseGeometry(this.geoItem.geometry)
    }

    this.attachToScene = function (scene, centerPoint) {
        if (!this.opts.gfx.geometry || !this.opts.gfx.material) {
            throw "Unknown geometry/material"
        }
        try {
            let geometry = new geometryClasses[this.opts.gfx.geometry.class](...this.opts.gfx.geometry.params)
            let material = new materialClasses[this.opts.gfx.material.class](...this.opts.gfx.material.params)

            this.mesh = new THREE.Mesh(geometry, material);
            let point = this.geometryCenter()
            this.mesh.position.x = (point.lat - centerPoint.lat) * 100000;
            this.mesh.position.y = 0;
            this.mesh.position.z = (point.lon - centerPoint.lon) * 100000;
            this.mesh.updateMatrix();
            this.mesh.matrixAutoUpdate = false;
            scene.add(this.mesh);
        } catch (e) {
            console.log(this.opts.gfx.geometry)
            console.log(this.opts.gfx.material)
            throw e
        }
    }

    this.attachToAudioModel = function (audioContext, centerPoint) {
        let point = this.geometryCenter()
        this.panner = new PannerNode(audioContext, merge(this.opts.audio, {
                positionX: (point.lat - centerPoint.lat) * 100000,
                positionY: 0,
                positionZ: (point.lon - centerPoint.lon) * 100000,
                orientationX: 0,
                orientationY: 1,
                orientationZ: 0
            })
        )
        if (this.opts.audio.src) {
            this.audioElement = document.createElement('audio')
            this.audioElement.src = this.opts.audio.src
            this.audioElement.loop = true
            this.audioElement.play()
            this.audioTrack = audioContext.createMediaElementSource(this.audioElement);
            this.audioTrack.connect(this.panner).connect(audioContext.destination);
        }
    }
}

export {GeoObject};

