import * as THREE from "three";
import {EventDispatcher} from "three";
import {World} from "./World";

var GeoObjectFactory = function (controls, scene, domElement) {

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
        "pid_zastavky": {
            geometry: new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1),
            material: new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true}),
            soundSrc: 'sounds/213564__woodylein__at-a-bus-stop.mp3'
        },
        "kultura_body": {
            geometry: new THREE.CylinderBufferGeometry(5, 10, 30, 5, 1),
            material: new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true})
        },
        "odpad_wc": {
            geometry: new THREE.CylinderBufferGeometry(5, 5, 30, 5, 1),
            material: new THREE.MeshPhongMaterial({color: 0x666666, flatShading: true})
        },
        "odpad_tridene_kontejnery": {
            geometry: new THREE.CylinderBufferGeometry(10, 10, 30, 5, 1),
            material: new THREE.MeshPhongMaterial({color: 0x666666, flatShading: true})
        },
        "odpad_sber": {
            geometry: new THREE.CylinderBufferGeometry(5, 10, 30, 5, 1),
            material: new THREE.MeshPhongMaterial({color: 0x666666, flatShading: true})
        },
        "policie": {
            geometry: new THREE.CylinderBufferGeometry(10, 5, 30, 10, 1),
            material: new THREE.MeshPhongMaterial({color: 0x0000ff, flatShading: true})
        },
        "priroda_pamatne_stromy": {
            geometry: new THREE.CylinderBufferGeometry(10, 5, 30, 12, 1),
            material: new THREE.MeshPhongMaterial({color: 0x00ff00, flatShading: true})
        }
    }

    this.geometryType = function(geoItem){
        if (!this.pointTables[geoItem.table_name]) {
            return null
        }
        return this.pointTables[geoItem.table_name].geometry
    }
    this.materialType = function(geoItem){
        if (!this.pointTables[geoItem.table_name]) {
            return null
        }
        return this.pointTables[geoItem.table_name].material
    }
    this.soundSrc = function(geoItem){
        if (!this.pointTables[geoItem.table_name]) {
            return null
        }
        return this.pointTables[geoItem.table_name].soundSrc
    }

    this.parseGeometry = function (geometry) {
        //input: POINT(14.322079278 50.0925608060001)
        let pos = geometry.match(/POINT\(([0-9.]*) ([0-9.]*)/i);
        return {lon: parseFloat(pos[1]), lat: parseFloat(pos[2])}
    }

    this.build = function(geoItem, centerPoint, scene, audioCtx){
        if(geoItem.tableName == 'technical_usage'){
            return null
        }
        const geometryType = this.geometryType(geoItem)
        const materialType = this.materialType(geoItem)
        if(!geometryType || !materialType){
            console.error("Unknown geoitem type")
            console.error(JSON.stringify(geoItem))
            return null
        }
        const mesh = new THREE.Mesh(geometryType, materialType);
        let point = this.parseGeometry(geoItem.geometry)
        mesh.position.x = (point.lat - centerPoint.lat) * 100000;
        mesh.position.y = 0;
        mesh.position.z = (point.lon - centerPoint.lon) * 100000;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        scene.add(mesh);


        const panner = new PannerNode(audioCtx, {
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
        const soundSrc = this.soundSrc(geoItem)
        if (soundSrc) {
            const audioElement = document.createElement('audio')
            audioElement.src = soundSrc
            audioElement.play()
            const track = audioCtx.createMediaElementSource(audioElement);
            track.connect(panner).connect(audioCtx.destination);
        }
    }

}

export {GeoObjectFactory};

