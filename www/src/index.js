let gfx = require('./webgfx')

gfx.loadSkybox('img/box.png')

// Create 3D objects.
var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(geometry, material);

// Position cube mesh in front of center of scene
cube.position.set(0, gfx.controls.userHeight, -1);

// Add cube mesh to your three.js scene
gfx.scene.add(cube);

// Request animation frame loop function
gfx.update = function(delta, timestamp) {
  // Apply rotation to cube mesh
  cube.rotation.y += delta * 0.0006;
}
