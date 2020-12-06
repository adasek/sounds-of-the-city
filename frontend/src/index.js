import * as THREE from 'three';

//import area from "./area.json";
//import { Terrain } from './jsm/terrain/terrain.js';
import { GeographyLoader } from './jsm/loader/Geography.js';
import { World } from './jsm/world/World.js';
import {OrbitControls} from './jsm/controls/OrbitControls.js';

let button, camera, controls, scene, renderer, time, listener, geographyLoader, world;

function doPlay(){
    button.style.display = 'none'
    init();

    // Vaclavak
    let point = { lat:  50.0796064, lon: 14.4300247 }
    // div sarka
    //let point = { lat:  50.0926997, lon: 14.3240239 }

    geographyLoader = new GeographyLoader( point.lat, point.lon )
    world.center.lat = point.lat
    world.center.lon = point.lon

    geographyLoader.addEventListener( 'geoDataLoaded', function ( event ) {
        world.updateGeoData(event.geoData, event.center)
    } );

    animate();
}

button = document.createElement("button")
button.innerHTML = "Start"
button.onclick=doPlay
document.body.appendChild(button)


function init() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(400, 200, 0);
    // controls
    controls = new OrbitControls(camera, renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    world = new World(controls, scene, renderer.domElement)

    world.addEventListener( 'positionUpdate', function ( event ) {
        geographyLoader.updateCoordinates(event.position.lat, event.position.lon)
    } );

    /*
    setInterval(function(){
        world.logNearest()
    },10000)
     */

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 100;
    controls.maxDistance = 500;

    controls.maxPolarAngle = Math.PI / 2;


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
    world.update(timeElapsed)
    controls.update(timeElapsed);

    render();

}

function render() {

    renderer.render(scene, camera);

}
