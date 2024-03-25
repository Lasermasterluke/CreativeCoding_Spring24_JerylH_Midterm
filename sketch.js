// global variable for the hill
let hill;

function setup() {
	createCanvas(windowWidth, windowHeight);
	// initialize hill
	hill = new Hill();
}

function draw() {
	background(220);
	hill.draw();
}

class Hill {
	constructor() {
		this.detail = 0.005; // detail level of the hill's shape
		this.steepness = 0.4; // controls the vertical scale of the hill
	}

	draw() {
		noFill();
		beginShape();
		let startHeight = height * this.steepness; // starting height at the left of the canvas
		for (let x = 0; x < width; x++) {
			// dynamically adjust the y-coordinate based on noise and scale it based on the canvas height
			let y = map(noise(x * this.detail), 0, 1, startHeight, 0) + (windowHeight / 2);
			// create an upward slope by decreasing startheight gradually
			startHeight -= this.steepness;
			vertex(x, y);
		}
		endShape();
	}
}