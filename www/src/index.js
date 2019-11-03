let gfx = require('./webgfx')

gfx.loadSkybox('img/box.png')

class ParticleSystem {
	constructor(scene, maxcount, ParticleType) {
		this.maxcount = maxcount
		this.count = 0
		this.Particle = ParticleType
		this.particles = []
		var geometry = new THREE.BufferGeometry()
		this.positions = new Float32Array(maxcount * 3)
		this.velocities = new Float32Array(maxcount * 3)
		this.buffer = new THREE.BufferAttribute(this.positions, 3)
		geometry.addAttribute('position', this.buffer)
		var material = new THREE.PointsMaterial({size:0.01})
		this.sceneobj = new THREE.Points(geometry, material)

		this.sceneobj.position.set(0, gfx.controls.userHeight - 0.5, -1)

		scene.add(this.sceneobj)
	}
	addParticle() {
		let particle = new this.Particle(this, this.count)
		this.particles[this.count] = particle
		this.count ++
		//this.buffer.array = this.positions.subarray(0,this.count)
		//this.generator(particle)
	}
	update(s) {
		for (let i = 0; i < this.count; ++ i) {
			//this.updator(particles[i])
			if (!this.particles[i].update(s)) {
				this.particles[i] = new this.Particle(this, i)
			}
		}
		this.buffer.needsUpdate = true
	}
}
class Particle {
	constructor(system, idx) {
		idx *= 3
		this.offset = idx
		this.pos = system.positions.subarray(idx, idx + 3)
		this.vel = system.velocities.subarray(idx, idx + 3)
	}
}
class DemoParticle extends Particle { // todo remove type-based properties, add generators, decay, and influencers
	constructor(system, idx) {
		super(system, idx)
		this.pos[0] = 0
		this.pos[1] = 0
		this.pos[2] = 0
		this.vel[1] = 0.5
		this.vel[0] = 0.1*(Math.random() - 0.5)
		this.vel[2] = 0.1*(Math.random() - 0.5)
	}
	update(s) {
		this.pos[0] += s * this.vel[0]
		this.pos[1] += s * this.vel[1]
		this.pos[2] += s * this.vel[2]
		this.vel[1] -= s * 0.125;
		return this.pos[1] >= 0
	}
}

// Create 3D objects.
var system = new ParticleSystem(gfx.scene, 256, DemoParticle)

// Request animation frame loop function
var lastTime = 0
gfx.update = function(delta, timestamp) {
  if (timestamp > lastTime && system.count < system.maxcount) {
    system.addParticle()
    lastTime += 0.01
  }
  system.update(delta)
  // Apply rotation
  //system.sceneobj.rotation.y += delta * 0.6
}
