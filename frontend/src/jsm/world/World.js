import {
    EventDispatcher
} from "three";
import {Avatar} from '../avatar/Avatar.js';
import {GeoObjectFactory} from './GeoObjectFactory.js';
import {GeographyHelper} from "../helper/Geography";
import * as THREE from "three";

var World = function (controls, scene, domElement) {
    this.controls = controls
    this.scene = scene
    this.avatar = new Avatar(scene, domElement)
    this.objects = {}
    this.center = {lat: null, lon: null}
    this.geoObjectFactory = new GeoObjectFactory()
    this.mapTiles = {}

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.listener = this.audioCtx.listener;

    this.updateGeoData = function (geoData) {

        // cleanup
        for (let key in this.objects) {
            if (GeographyHelper.calculateDistance(this.avatar.getGPSPosition(this.center), this.objects[key].geometryCenter()) > 0.3) {
                this.objects[key].destroy()
                delete (this.objects[key])
            }
        }

        // load new objects
        for (let objectType in geoData) {
            //geoData[objectType]
            if (!Array.isArray(geoData[objectType])) {
                continue;
            }
            for (let geoItem of geoData[objectType]) {
                if (geoItem.table_name + "_" + geoItem.objectid in this.objects) {
                    continue
                }
                let newObject = this.geoObjectFactory.build(geoItem, this.center, this.scene, this.audioCtx)
                if (newObject == null) {
                    continue;
                }
                if (newObject.hash() in this.objects) {
                    throw "Duplicate object hash " + newObject.hash()
                }
                this.objects[newObject.hash()] = newObject
            }
        }

        // Load osm tiles
        let tileX = GeographyHelper.lon2tile(this.avatar.getGPSPosition(this.center).lon, 16)
        let tileY = GeographyHelper.lat2tile(this.avatar.getGPSPosition(this.center).lat, 16)

        let tileImage = `https://a.tile.openstreetmap.org/16/${tileX}/${tileY}.png`
        if (!(tileImage in this.mapTiles)) {
            // count the tileImage position
            let leftTop = {lon: GeographyHelper.tile2lon(tileX, 16), lat: GeographyHelper.tile2lat(tileY, 16)}
            let rightBottom = {
                lon: GeographyHelper.tile2lon(tileX + 1, 16),
                lat: GeographyHelper.tile2lat(tileY + 1, 16)
            }

            const leftTopLocal = GeographyHelper.gpsToLocal(leftTop, this.center)
            const rightBottomLocal = GeographyHelper.gpsToLocal(rightBottom, this.center)
            const texture = new THREE.TextureLoader().load(tileImage);
            const material = new THREE.MeshBasicMaterial({map: texture});
            const geometry = new THREE.PlaneGeometry(Math.abs(rightBottomLocal.z - leftTopLocal.z), Math.abs(rightBottomLocal.x - leftTopLocal.x));
            let plane = new THREE.Mesh(geometry, material);

            plane.rotateOnWorldAxis ( new THREE.Vector3(1,0,0), 3*Math.PI/2 )
            plane.rotateOnWorldAxis ( new THREE.Vector3(0,1,0), 3*Math.PI/2 )

            const moveInGlobal = new THREE.Vector3(
                    (leftTopLocal.x + rightBottomLocal.x) / 2,
                    0,
                    (leftTopLocal.z + rightBottomLocal.z) / 2
                )
            const moveInLocal = plane.worldToLocal(moveInGlobal)
            plane.translateX(moveInLocal.z)
            plane.translateY(moveInLocal.x)
            this.scene.add(plane)

            this.mapTiles[tileImage] = true
        }
    }

    this.logNearest = function () {
        let objectsSorted = [...Object.values(scope.objects)]
        var avatar = scope.avatar
        var center = scope.center
        objectsSorted.sort(function (a, b) {
            const distA = GeographyHelper.calculateDistance(avatar.getGPSPosition(center), a.geometryCenter())
            const distB = GeographyHelper.calculateDistance(avatar.getGPSPosition(center), b.geometryCenter())
            return distA - distB
        })
        for (let i = 0; i < 3; i++) {
            const dist = GeographyHelper.calculateDistance(avatar.getGPSPosition(center), objectsSorted[i].geometryCenter())

            console.log("Distance " + dist + ":")
            console.log(objectsSorted[i])
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
