import * as THREE from 'three';

import {OrbitControls} from './jsm/controls/OrbitControls.js';
import {Avatar} from './jsm/avatar/Avatar.js';
//import area from "./area.json";
//import { Terrain } from './jsm/terrain/terrain.js';
const area = require('../area.json')

let camera, controls, scene, renderer, avatar, time, listener;

init();
animate();

function parseGeometry(geometry) {
    //input: POINT(14.322079278 50.0925608060001)
    let pos = geometry.match(/POINT\(([0-9.]*) ([0-9.]*)/i);
    return {lon: parseFloat(pos[1]), lat: parseFloat(pos[2])}
}


function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(400, 200, 0);

    // Audio
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    listener = audioCtx.listener;
    const pannerModel = 'HRTF';
    const innerCone = 360;
    const outerCone = 360;
    const outerGain = 0.3;
    const distanceModel = 'linear';
    const maxDistance = 10000;
    const refDistance = 1;
    const rollOff = 10;

    // controls

    controls = new OrbitControls(camera, renderer.domElement);
    avatar = new Avatar(scene, renderer.domElement)

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 100;
    controls.maxDistance = 500;

    controls.maxPolarAngle = Math.PI / 2;

    // world
    const geometry = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1);
    const material = new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true});

    let centerLat = 50.092656
    let centerLon = 14.3225442
        //console.dir(area)
        const pointTables = [
        {
            table: "pid_stops",
            geometry: new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1),
            material: new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true}),
            soundSrc: 'sounds/213564__woodylein__at-a-bus-stop.wav'
        },
        {
            table: "culture_venues",
            geometry: new THREE.CylinderBufferGeometry(5, 10, 30, 5, 1),
            material: new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true})
        },
            {
                table: "trash_wc",
                geometry: new THREE.CylinderBufferGeometry(5, 5, 30, 5, 1),
                material: new THREE.MeshPhongMaterial({color: 0x666666, flatShading: true})
            },
            {
                table: "trash_containers",
                geometry: new THREE.CylinderBufferGeometry(10, 10, 30, 5, 1),
                material: new THREE.MeshPhongMaterial({color: 0x666666, flatShading: true})
            },
            {
                table: "trash_centers",
                geometry: new THREE.CylinderBufferGeometry(5, 10, 30, 5, 1),
                material: new THREE.MeshPhongMaterial({color: 0x666666, flatShading: true})
            },
            {
                table: "police",
                geometry: new THREE.CylinderBufferGeometry(10, 5, 30, 10, 1),
                material: new THREE.MeshPhongMaterial({color: 0x0000ff, flatShading: true})
            },
            {
                table: "nature_memorial_trees",
                geometry: new THREE.CylinderBufferGeometry(10, 5, 30, 12, 1),
                material: new THREE.MeshPhongMaterial({color: 0x00ff00, flatShading: true})
            }
        ]
    pointTables.forEach((pointTable) => {
            for (let i = 0; i < area[pointTable.table].length; i++) {
                const mesh = new THREE.Mesh(pointTable.geometry, pointTable.material);
                let point = parseGeometry(area[pointTable.table][i].geometry)
                mesh.position.x = (point.lat - centerLat) * 100000;
                mesh.position.y = 0;
                mesh.position.z = (point.lon - centerLon) * 100000;
                mesh.updateMatrix();
                mesh.matrixAutoUpdate = false;
                scene.add(mesh);

                if(pointTable.soundSrc){

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

                    const audioElement = document.createElement('audio')
                    audioElement.src = pointTable.soundSrc
                    audioElement.play()
                    const track = audioCtx.createMediaElementSource(audioElement);
                    track.connect(panner).connect(audioCtx.destination);
                }

            }
        }
    )

    // Time
    time = new Date()

    // lights

    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x002288);
    dirLight2.position.set(-1, -1, -1);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);
    let currentTime = new Date();
    let timeElapsed = currentTime - time;
    time = currentTime

    controls.update(timeElapsed);
    let positionDiff = avatar.update(timeElapsed);

    controls.target.x = avatar.object.position.x
    controls.target.y = avatar.object.position.y
    controls.target.z = avatar.object.position.z

    controls.object.position.x -= positionDiff.x
    controls.object.position.y -= positionDiff.y
    controls.object.position.z -= positionDiff.z

    //audio
    listener.positionX.value = avatar.object.position.x;
    listener.positionY.value = avatar.object.position.y;
    listener.positionZ.value = avatar.object.position.z;

    listener.forwardX.value = avatar.forwardVector.x;
    listener.forwardY.value = avatar.forwardVector.y;
    listener.forwardZ.value = avatar.forwardVector.z;
    listener.upX.value = avatar.up.x;
    listener.upY.value = avatar.up.y;
    listener.upZ.value = avatar.up.z;

    render();

}

function render() {

    renderer.render(scene, camera);

}
