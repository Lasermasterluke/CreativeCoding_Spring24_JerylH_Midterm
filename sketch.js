// global variable for the hill
let hill;
let sisyphus;
let clouds = []; // array for storing clouds
let acceleration = 0.0001; // rate of acceleration
let maxScrollSpeed = 0.05;
let sisyphusVertices = []; // array for storing sisyphus
let isMovingForward = 0; // flag for whether sisyphus is moving forward

function setup() {
    createCanvas(windowWidth, windowHeight - 4);
	// initialize hill & sisyphus
    hill = new Hill();
    sisyphus = new Sisyphus(300);

    frameRate(60);
    angleMode(DEGREES);

    // initialize clouds
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: random(width),
            y: random(height / 4),
            size: random(60, 120),
        });
    }

    // initialize the vertices for sisyphus
    sisyphusVertices = [
        { x: -10 + random(-3, 3), y: -15 + random(-3, 3) },
        { x: 10 + random(-3, 3), y: -10 + random(-3, 3) },
        { x: 15 + random(-3, 3), y: 0 + random(-3, 3) },
        { x: 10 + random(-3, 3), y: 10 + random(-3, 3) },
        { x: 0 + random(-3, 3), y: 15 + random(-3, 3) },
        { x: -10 + random(-3, 3), y: 10 + random(-3, 3) },
        { x: -15 + random(-3, 3), y: 0 + random(-3, 3) },
    ];
}

function draw() {
	background(69, 179, 224);
	
	// draw and scroll clouds
    for (let i = 0; i < clouds.length; i++) {
    let cloud = clouds[i];
    drawCloud(cloud);
    cloud.x -= 1; // scroll speed

    if (cloud.x < -200) { // reset cloud
        clouds[i] = {
            x: width + 100,
            y: random(height / 4),
            size: random(60, 120)
        };
    }
}
	
	hill.update();
	hill.draw();
	
	sisyphus.update(hill.getY(sisyphus.x)); // update sisyphus position based on hill y-pos
	sisyphus.draw();
	
	
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function drawCloud(cloud) {
    fill(255); // clouds are white
    noStroke(); // no outline for a softer appearance
	ellipse(cloud.x, cloud.y, 50, 50);
    // main body of the cloud
    ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6);

    // additional ellipses for fluffiness
    ellipse(cloud.x - cloud.size / 3, cloud.y, cloud.size / 2, cloud.size / 3);
    ellipse(cloud.x + cloud.size / 3, cloud.y - cloud.size / 4, cloud.size / 2, cloud.size / 3);
    ellipse(cloud.x + cloud.size / 4, cloud.y + cloud.size / 5, cloud.size / 3, cloud.size / 4);
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
		for (let i = 0; i < 30; i++) {
			let initialX = i * (width / 100) + random(width);
        	let initialY = random(height / 2, height);
			this.details.push({
				x: initialX,
				y: initialY,
				yOffset: initialY - this.getY(initialX), // Store the vertical offset from the hill's current y
				size: random(5, 20),
				type: random() > 0.5 ? 'rock' : 'foliage'
			});
		}
	}
	
	draw() {
		fill(138, 69, 19);;
		stroke(0);
		strokeWeight(1);
		beginShape();
		vertex(0, height);
		// draw the hill using noise
		for (let x = 0; x < width; x++) {
			let y = this.getY(x);
			vertex(x, y);
		}
		vertex(width, height);
		endShape();
		
		this.details.forEach(detail => {
            this.drawDetail(detail.x, detail.y, detail.size, detail.type);
        });
	}
	
    scrollDetails(isScrollingBackward) {
		this.details.forEach(detail => {
			// calculate the new horizontal position
			detail.x += isScrollingBackward ? this.scrollSpeed * 200 : -this.scrollSpeed * 200;

			// wrap details to the opposite side of the canvas when they scroll off one side
			if (detail.x < -50) {
				detail.x = width + 50;  // wrap from left to right
				detail.y = random(this.getY(detail.x) + 20, height)
			} else if (detail.x > width + 50) {
				detail.x = -50;  // wrap from right to left
			}
			
			// adjust the vertical position based on the hill's current y value at the new x position
			detail.y = this.getY(detail.x) + detail.yOffset;
			
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
		if (keyIsDown(RIGHT_ARROW)) {
			// allow scrolling only if sisyphus is not at the starting point or can move forward
			this.offset += this.scrollSpeed;
			this.scrollSpeed = max(this.scrollSpeed - acceleration, 0.01);
			this.scrollDetails(false);
			isMovingForward = 1;
		} else if (this.offset > 0) {
			// if not pressing right and there's an offset, scroll back towards start
			this.offset -= this.scrollSpeed;
			this.scrollSpeed = min(this.scrollSpeed + acceleration, maxScrollSpeed);
			this.scrollDetails(true);
			isMovingForward = 0;
		} else {
			isMovingForward = 2;
		}
	}
	
	getY(x) {
		// returns the y value on the hill at a given x position
		let startHeight = height / 2;
		let y = (this.slope * x) + noise(this.offset + x * this.detail) * 100 + startHeight;
		return y;
	}
}

class Sisyphus {
    constructor(x) {
        this.x = x; // fixed x position
        this.y = 0; // updated based on hill y
        this.height = 30; // general size of the rock
        this.rotation = 0; // initial rotation angle
        this.rotationSpeed = 5; // speed of rotation in degrees
    }

    update(y) {
        this.y = y - this.height / 2;
        // adjust rotation based on movement direction
        if (isMovingForward === 1) {
            this.rotation += this.rotationSpeed; // rotate clockwise when moving forward
        } else if (isMovingForward === 0) {
            this.rotation -= this.rotationSpeed; // rotate counterclockwise when moving backward
        }

        // keep the rotation between 0 and 360 degrees
        this.rotation = (this.rotation + 360) % 360;
    }

    draw() {
        fill(128);
        stroke(0);
        strokeWeight(2);
		
        push();
        translate(this.x, this.y); // move to sisyphus's position
        rotate(this.rotation); // rotate by the defined angle

        beginShape();
        // loop through each vertex in sisyphusVertices
        for (let i = 0; i < sisyphusVertices.length; i++) {
            const v = sisyphusVertices[i]; // get current vertex
            vertex(v.x, v.y); // plot each vertex
        }
        endShape(CLOSE);

        pop();
    }
}