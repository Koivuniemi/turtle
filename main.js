import * as THREE from "./three/build/three.module.js";
import { OrbitControls } from "./three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./three/examples/jsm/loaders/GLTFLoader.js";
import { Act, data_external } from "./turtleActionThree.js";
import "./index.js";

const ws = new WebSocket("ws://localhost:9999");
const scene = new THREE.Scene();

const canvas = document.querySelector( "#c" );
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    sortObjects: false
});
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight )
camera.position.z = 20;

const controls = new OrbitControls( camera, renderer.domElement );
const gltfLoader = new GLTFLoader();

// Turtle
gltfLoader.load("./Textures/turtle.gltf", (gltf) => {
    const turtle = gltf.scene;
    turtle.depthWrite = false;
    turtle.depthTest = false;
    scene.add(turtle);

    // Turtle Actions
    ws.addEventListener("message", msg => {
        let data = JSON.parse(msg.data);
        if (data["response"]) {
            Act(data, turtle);
        }
    });
});

// Light
const light = new THREE.AmbientLight( 0x404040, 5 );
scene.add( light );

function hoverOver() {
    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObject( scene );
    if (intersects[0]) {
        let object = intersects[0]["object"];
        while (true) {
            if (object["parent"]["type"] != "Scene") {
                object = object["parent"];
            } else {
                let block = data_external.find(block => 
                    block["name"] == object["name"]);
                if (block) {
                    if (document.getElementById("info").innerHTML != block["block_type"]) {
                        document.getElementById("info").innerHTML = block["block_type"].slice(10);
                    }
                }
                break;
            }
        }
        setTimeout(() => {
            document.getElementById("info").innerHTML = "";
        }, 100);
    }
}

function render(time) {
    time *= 0.001;

    hoverOver();
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function onPointerMove( event ) {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

window.addEventListener( 'pointermove', onPointerMove );

requestAnimationFrame(render);

export { scene, camera };