import { scene, camera } from "./main.js";
import * as THREE from "./three/build/three.module.js";


const _VS_ = `
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const _FS_ = `
void main() {
    gl_FragColor = vec4(0.0, 0.5, 0.0, 0.9);
}
`;

var data_internal = {
    position: { x: 0, y: 0, z: 0 },
    facing: 0,
    inventory: {
        // 0th index item, 1th index amount
        1:  [0, 0], 2:  [0, 0],  3: [0, 0],  4: [0, 0],
        5:  [0, 0], 6:  [0, 0],  7: [0, 0],  8: [0, 0],
        9:  [0, 0], 10: [0, 0], 11: [0, 0], 12: [0, 0],
        13: [0, 0], 14: [0, 0], 15: [0, 0], 16: [0, 0]
    }
};

var data_external = [];

var cardinal_directions = {
    north:  0,
    east:   1,
    south:  2,
    west:   3
};

export { data_internal, data_external };

// Blocks and Lines
const box = new THREE.BoxGeometry( 3, 3, 3 );
const edges = new THREE.EdgesGeometry( box );
const edges_material = new THREE.LineBasicMaterial( {
    color: 0x000000
});
const box_material = new THREE.MeshBasicMaterial({
    color: 0x006400,
    opacity: 0.9,
    transparent: true,
});

function moveFaceFront(obj) {
    if (data_internal["facing"] == 0) {
        data_internal["position"]["x"]++;
    } else if (data_internal["facing"] == 1) {
        data_internal["position"]["z"]++;
    } else if (data_internal["facing"] == 2) {
        data_internal["position"]["x"]--;
    } else if (data_internal["facing"] == 3) {
        data_internal["position"]["z"]--;
    }
    obj.translateX(3);
}

function moveFaceBack(obj) {
    if (data_internal["facing"] == 0) {
        data_internal["position"]["x"]--;
    } else if (data_internal["facing"] == 1) {
        data_internal["position"]["z"]--;
    } else if (data_internal["facing"] == 2) {
        data_internal["position"]["x"]++;
    } else if (data_internal["facing"] == 3) {
        data_internal["position"]["z"]++;
    }
    obj.translateX(-3);
}

function drawBlock(block_position) {
    let x = block_position[ "x" ] * 3;
    let y = block_position[ "y" ] * 3;
    let z = block_position[ "z" ] * 3;
    const mesh = new THREE.Mesh( box, box_material );
    const line = new THREE.LineSegments( edges, edges_material );
    
    mesh.add( line );
    mesh.name = `${x/3}_${y/3}_${z/3}`;
    mesh.position.set( x, y, z );

    scene.add( mesh );
}

function pushFrontBlockData(block) {
    let block_position = JSON.parse( JSON.stringify(data_internal["position"]) );
        if (data_internal["facing"] == 0) {
            block_position["x"]++;
        } else if (data_internal["facing"] == 1) {
            block_position["z"]++;
        } else if (data_internal["facing"] == 2) {
            block_position["x"]--;
        } else if (data_internal["facing"] == 3) {
            block_position["z"]--;
        }
        block_position["block_type"] = block;
        block_position["name"] = `${block_position["x"]}_${block_position["y"]}_${block_position["z"]}`;

        drawBlock(block_position);

        data_external.push( block_position );
        console.log( data_external );
        console.log( data_internal );
}

function pushUpBlockData(block) {
    let block_position = JSON.parse( JSON.stringify(data_internal["position"]) );
    block_position["y"]++;
    block_position["block_type"] = block;
    block_position["name"] = `${block_position["x"]}_${block_position["y"]}_${block_position["z"]}`;

    drawBlock(block_position);

    data_external.push( block_position );
}

function pushDownBlockData(block) {
    let block_position = JSON.parse( JSON.stringify(data_internal["position"]) );
    block_position["y"]--;
    block_position["block_type"] = block;
    block_position["name"] = `${block_position["x"]}_${block_position["y"]}_${block_position["z"]}`;

    drawBlock(block_position);

    data_external.push( block_position );
}

function has_block() {
    let x = data_internal["position"]["x"];
    let y = data_internal["position"]["y"];
    let z = data_internal["position"]["z"];
    if (data_internal["facing"] == 0) {
        x++;
    } else if (data_internal["facing"] == 1) {
        z++;
    } else if (data_internal["facing"] == 2) {
        x--;
    } else if (data_internal["facing"] == 3) {
        z--;
    }
    return scene.getObjectByName(`${x}_${y}_${z}`)
}

function has_blockUp() {
    let x = data_internal["position"]["x"];
    let y = data_internal["position"]["y"] + 1;
    let z = data_internal["position"]["z"];
    return scene.getObjectByName(`${x}_${y}_${z}`)
}

function has_blockDown() {
    let x = data_internal["position"]["x"];
    let y = data_internal["position"]["y"] - 1;
    let z = data_internal["position"]["z"];
    return scene.getObjectByName(`${x}_${y}_${z}`)
}

export function Act(msg, obj) {
    // Inspecting
    if (msg["response"] == "inspect" && msg["block"] != "minecraft:air") {
        let mesh = has_block();
        if ( !mesh ) {
            pushFrontBlockData(msg["block"]);
        }
    } else if (msg["response"] == "inspectUp" && msg["block"] !== "minecraft:air") {
        let mesh = has_blockUp();
        if ( !mesh ) {
            pushUpBlockData(msg["block"]);
        }
    } else if (msg["response"] == "inspectDown" && msg["block"] !== "minecraft:air") {
        let mesh = has_blockDown();
        if ( !mesh ) {
            pushDownBlockData(msg["block"]);
        }
    } 
    
    // Moving
    else if (msg["result"] == "true" && msg["response"] == "front") {
        moveFaceFront(obj);
    } else if (msg["result"] == "true" && msg["response"] == "back") {
        moveFaceBack(obj);
    } else if (msg["result"] == "true" && msg["response"] == "up") {
        data_internal["position"]["y"]++;
        obj.translateY(3);
    } else if (msg["result"] == "true" && msg["response"] == "down") {
        data_internal["position"]["y"]--;
        obj.translateY(-3);
    } else if (msg["result"] == "true" && msg["response"] == "turnLeft") {
        if (data_internal["facing"] == 0) {
            data_internal["facing"] = 3;
        } else {
            data_internal["facing"]--;
        }
        obj.rotation.y += Math.PI / 2
    } else if (msg["result"] == "true" && msg["response"] == "turnRight") {
        if (data_internal["facing"] == 3) {
            data_internal["facing"] = 0;
        } else {
            data_internal["facing"]++;
        }
        obj.rotation.y -= Math.PI / 2
    }

    // Digging
    else if (msg["result"] == "true" && msg["response"] == "dig") {
        let mesh = has_block();
        if ( mesh ) {
            mesh.removeFromParent();
        }
    } else if (msg["result"] == "true" && msg["response"] == "digUp") {
        let mesh = has_blockUp();
        if ( mesh ) {
            mesh.removeFromParent();
        }
    } else if (msg["result"] == "true" && msg["response"] == "digDown") {
        let mesh = has_blockDown();
        if ( mesh ) {
            mesh.removeFromParent();
        }
    }
}
