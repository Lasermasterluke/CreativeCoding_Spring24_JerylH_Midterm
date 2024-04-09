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
	background(69, 179, 224);
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
				y: random(height / 2, height),
				size: random (5, 20),
				type: random() > 0.5 ? 'rock' : 'foliage',
				init: false, // initialization flag
				vertices: [] // vertices storage for rocks
			});
		}
	}
	
	draw() {
		fill(138, 69, 19);;
		stroke(0);
		beginShape();
		vertex(0, height);
		// draw the hill using noise
		for (let x = 0; x < width; x++) {
			let y = this.getY(x);
			vertex(x, y);
		}
		vertex(width, height);
		endShape();
		
		// scroll and draw details
		this.scrollDetails();
	}
	
    scrollDetails() {
        this.details.forEach(detail => {
            detail.x -= this.scrollSpeed * 200; // scroll horizontally
			
			detail.y += Math.abs(this.slope * this.scrollSpeed * 200); 

            // reset details to the right side of the screen if they go out of bounds
			if (detail.x < -detail.size || detail.y > height) { 
				detail.originalX = width + random(100); // place it off the right edge with some randomness
				detail.x = detail.originalX;

				// calculate the hill's y value at this x position to ensure details are beneath the line
				let hillY = this.getY(detail.x);
				detail.y = random(hillY + detail.size / 2, height - detail.size / 2);
			}
            this.drawDetail(detail.x, detail.y, detail.size, detail.type);
        });
}
	
	drawDetail(x, y, size, type) {
    	if (type === 'rock') {
			fill(128); // grey color for rocks
			stroke(0); // black stroke for visibility

			// determine pattern based on size
			let pattern = size % 3;

			beginShape();
			if (pattern === 0) {
				// first pattern
				vertex(x - size / 2, y - size / 2);
				vertex(x, y - size / 1.5);
				vertex(x + size / 2, y - size / 2);
				vertex(x + size / 1.5, y);
				vertex(x + size / 2, y + size / 2);
				vertex(x, y + size / 1.5);
				vertex(x - size / 2, y + size / 2);
				vertex(x - size / 1.5, y);
			} else if (pattern === 1) {
				// second pattern
				vertex(x - size / 2, y);
				vertex(x - size / 4, y - size / 4);
				vertex(x, y - size / 2);
				vertex(x + size / 4, y - size / 4);
				vertex(x + size / 2, y);
				vertex(x + size / 4, y + size / 4);
				vertex(x, y + size / 2);
				vertex(x - size / 4, y + size / 4);
			} else {
				// third pattern
				vertex(x - size / 3, y - size / 3);
				vertex(x, y - size / 2);
				vertex(x + size / 3, y - size / 3);
				vertex(x + size / 2, y);
				vertex(x + size / 3, y + size / 3);
				vertex(x, y + size / 2);
				vertex(x - size / 3, y + size / 3);
				vertex(x - size / 2, y);
			}
			endShape(CLOSE);
			
		} else { // drawing a bush with rectangles for leaves
			// layering leaves with varying opacity for depth
			const leafCount = 5; // total number of leaves in a bush
			for (let i = 0; i < leafCount; i++) {
				fill(34, 139, 34, 150); // green for foliage with some transparency
				const leafWidth = size * 0.6;
				const leafHeight = size * 0.4;

				// draw the main body of the bush
				rect(x - leafWidth / 2, y - leafHeight / 2, leafWidth, leafHeight);

				// draw additional "leaves" around the main body to simulate a bush
				rect(x - size * 0.5, y - size * 0.2, leafWidth * 0.5, leafHeight * 0.5);
				rect(x + size * 0.2, y - size * 0.1, leafWidth * 0.6, leafHeight * 0.6);
				rect(x - size * 0.4, y + size * 0.1, leafWidth * 0.4, leafHeight * 0.4);
        	}
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