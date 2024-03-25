// global variable for the hill
let hill;

function setup() {
	createCanvas(windowWidth, windowHeight);
	// initialize hill
	hill = new Hill();
	sisyphus = new Sisyphus(300);
	frameRate(60);
}

function draw() {
	background(220);
	hill.update();
	hill.draw();
	sisyphus.update(hill.getY(sisyphus.x)); // update sisyphus position based on hill y-pos
	sisyphus.draw();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

class Hill {
	constructor() {
		this.detail = 0.005; // detail level of the hill's shape
		this.vertScale = 1; // controls the vertical scale of the hill
		this.offset = 0; // offset to "move" the hill
		this.slope = -.25 // adjust slope for steepness
	}

	draw() {
		noFill();
		stroke(0);
		beginShape();
		let startHeight = height / 2; // starting height at the left of the canvas
		for (let x = 0; x < width; x++) {
			let y = this.getY(x);
			vertex(x, y);
		}
		endShape();
	}
	
	update() {
		this.offset += .005;
	}
	
	getY(x) {
		// returns the y value on the hill at a given x position
		let startHeight = height / 2;
		let y = (this.slope * x) + noise(this.offset + x * this.detail) * 100 + startHeight;
		return y;
	}
}

class Sisyphus{
	constructor(x) {
		this.x = x; // fixed x-position
		this.y = 0; // y changes with hill y value
		this.height = 30;
	}
	
	update(y) {
		this.y = y - this.height / 2; // update y-posiition with hill y value
	}
	
	draw() {
		fill(0);
		ellipse(this.x, this.y, this.height, this.height); // placeholder sisyphus
	}
}