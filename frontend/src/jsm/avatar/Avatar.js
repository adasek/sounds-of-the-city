import {
    EventDispatcher,
    Vector3
} from "three";
import * as THREE from "three";

var Avatar = function ( scene, domElement ) {
    this.domElement = domElement;

    this.up = new Vector3(0,1,0)
    this.forwardVector = new Vector3(0,1,0)
    this.directionAngle = 0
    this.speedPerMs = 0.05 // per ms
    this.rotateSpeed = 0.005 // rad per ms

    const geometry = new THREE.CylinderBufferGeometry( 10, 10, 30, 3, 3 );
    const material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } )

    this.object = new THREE.Mesh( geometry, material );
    //console.log(geometry.faces)
    this.object.position.x = 0;
    this.object.position.y = 0;
    this.object.position.z = 0;
    this.object.updateMatrix();

    scene.add( this.object );

    // Controls
    this.keyTable = {left: false, right: false, forward: false, backward: false}

    this.update = function () {

        return function update(timeElapsed) {
            // movement
            let originalPosition = this.object.position.clone()

            if(scope.keyTable.forward){
                //direction
                this.object.position.x +=  Math.sin(this.directionAngle) * this.speedPerMs * timeElapsed
                this.object.position.z +=  Math.cos(this.directionAngle) * this.speedPerMs * timeElapsed
            }
            if(scope.keyTable.backward){
                //direction
                this.object.position.x +=  Math.sin(Math.PI + this.directionAngle) * this.speedPerMs * timeElapsed
                this.object.position.z +=  Math.cos(Math.PI + this.directionAngle) * this.speedPerMs * timeElapsed
            }
            if(scope.keyTable.right){
                this.directionAngle -=  this.rotateSpeed  * timeElapsed
                this.object.rotation.y = this.directionAngle;
            }
            if(scope.keyTable.left){
                this.directionAngle +=  this.rotateSpeed  * timeElapsed
                this.object.rotation.y = this.directionAngle;
            }

            this.forwardVector.x = this.object.position.x +  Math.sin(this.directionAngle)
            this.forwardVector.y = this.object.position.y
            this.forwardVector.z = this.object.position.z +  Math.sin(this.directionAngle)

            this.object.updateMatrix();
            return originalPosition.sub(this.object.position);
            //return new Vector3(0,0,0)
        };

    }();


    var scope = this;


    scope.domElement.ownerDocument.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        if (keyCode == 87) {
            scope.keyTable.forward = true
        } else if (keyCode == 83) {
            scope.keyTable.backward = true
        } else if (keyCode == 65) {
            scope.keyTable.left = true
        } else if (keyCode == 68) {
            scope.keyTable.right = true
        }
    }
    scope.domElement.ownerDocument.addEventListener("keyup", onDocumentKeyUp, false);
    function onDocumentKeyUp(event) {
        var keyCode = event.which;
        if (keyCode == 87) {
            scope.keyTable.forward = false
        } else if (keyCode == 83) {
            scope.keyTable.backward = false
        } else if (keyCode == 65) {
            scope.keyTable.left = false
        } else if (keyCode == 68) {
            scope.keyTable.right = false
        }
    }

    this.update();

};

Avatar.prototype = Object.create( EventDispatcher.prototype );
Avatar.prototype.constructor = Avatar;


export { Avatar };
