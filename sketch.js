// global variable for the hill
let hill;

function setup() {
	createCanvas(windowWidth, windowHeight);
	// initialize hill & sisyphus
	hill = new Hill();
	sisyphus = new Sisyphus(300);
	frameRate(60);
	angleMode(DEGREES);
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
		this.details = [];
		this.scrollSpeed = 0.01;
//		this.scrollSpeed = 2; // used to test scrolling of details
		this.populateDetails();
	}
	
	populateDetails() {
		// function to populate the array to allow for scrolling foliage effect
		for (let i = 0; i < 50; i++) {
			this.details.push({
				originalX: i * (width / 50) + random(width),
				x: i * (width / 50) + random(width),
				y: random(height / 2, height) - 30,
				size: random (5, 20),
				type: random() > 0.5 ? 'rock' : 'foliage'
			});
		}
	}
	
	draw() {
		noFill();
		stroke(0);
		beginShape();
		// draw the hill using noise
		for (let x = 0; x < width; x++) {
			let y = this.getY(x);
			vertex(x, y);
		}
		endShape();
		
		// scroll and draw details
		this.scrollDetails();
	}
	
    scrollDetails() {
        this.details.forEach(detail => {
            detail.x -= this.scrollSpeed * 200; // scroll horizontally

            // scroll vertically based on slope. Adjust if the slope is steep.
            detail.y -= this.slope * this.scrollSpeed * 200;

            // reset details to the right side of the screen if they go out of bounds
            if (detail.x < -detail.size || detail.y < -detail.size) {
                detail.x = width + random(100); // place it off the right edge with some randomness
                detail.y = random(height / 2, height); // randomize the y position
            }

            this.drawDetail(detail.x, detail.y, detail.size, detail.type);
        });
}
	
	drawDetail(x, y, size, type) {
		if (type === 'rock') {
			fill(128);
			ellipse(x, y, size);
		} else {
			fill(34, 139, 34);
			ellipse(x, y, size, size * 1.5);
		}
	}
	
	update() {
		this.offset += this.scrollSpeed;
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