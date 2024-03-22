function setup() {
	createCanvas(windowWidth, windowHeight); // set the canvas to match the window dimensions
	noLoop(); // disable continuous drawing
}

function draw() {
	background(255); // set background color to white
	stroke(0); // set stroke color to black for the shapes
	fill(200); // set fill color to a light gray for the steps

	// define the dimensions and number of the steps
	let stepWidth = 50;
	let stepHeight = 10;
	let depth = 1000;
	let steps = 10;

	// calculate the starting position
	let startX = width / 2 - steps * (stepWidth / 2);
	let startY = height / 2 + steps * (stepHeight / 2);

	// draw the steps
	for (let i = 0; i < steps; i++) {
  	// draw the top face of the step
    beginShape();
    vertex(startX + i * stepWidth, startY - i * stepHeight);
	//ellipse(startX + (i + 0.5) * stepWidth, startY - (i + 1) * stepHeight, 10, 10);
    vertex(startX + (i + 1) * stepWidth, startY - i * stepHeight);
    vertex(startX + (i + 0.5) * stepWidth, startY - (i + 1) * stepHeight);
    vertex(startX + (i - 0.5) * stepWidth, startY - (i + 1) * stepHeight);
    endShape(CLOSE);

    // draw the front face of the step
	//ellipse(startX + (i + 1) * stepWidth, startY - i * stepHeight, 10, 10);
    beginShape();
    vertex(startX + i * stepWidth, startY - i * stepHeight);
    vertex(startX + (i + 1) * stepWidth, startY - i * stepHeight);
    vertex(startX + (i + 1) * stepWidth, startY - i * stepHeight + depth);
    vertex(startX + i * stepWidth, startY - i * stepHeight + depth);
    endShape(CLOSE);
		
	// draw line to finish left face of step
	line(
		startX + i * stepWidth,
		startY - i * stepHeight,
		
	)
	
	// draw over lines to create a flat looking face
	for (let i = 0; i < steps - 1; i++) {
		stroke(200);
		strokeWeight(1);
		line(
			startX + (i + 1) * stepWidth,
			startY - i * stepHeight + 1,
			startX + (i + 1) * stepWidth,
			startY - i * stepHeight + depth
		);
		stroke(0);
		strokeWeight(1);
	}

}

  // draw the vertical lines for the steps on the left side
	for (let j = -1; j < steps - 1; j++) {
		if (j == -1) {
			line(
				startX + (j + 0.5) * stepWidth,
				startY - (j + 1) * stepHeight - stepHeight,
				startX + (j + 0.5) * stepWidth,
				startY - (j + 1) * stepHeight + depth
			)
		} else {
			line(
				startX + (j + 0.5) * stepWidth,
				startY - (j + 1) * stepHeight,
				startX + (j + 0.5) * stepWidth,
				startY - (j + 1) * stepHeight - stepHeight
			);
		}

	}
  
  // connect the bottom-most step to the top-most step to create the illusion
//  line(
//    startX,
//    startY + depth,
//    startX - stepWidth / 2,
//    startY - stepHeight + depth
//  );
//  
//  line(
//    startX - stepWidth / 2,
//    startY - stepHeight + depth,
//    startX,
//    startY - stepHeight
//  );
//  
//  line(
//    startX,
//    startY - stepHeight,
//    startX + stepWidth,
//    startY - stepHeight
//  );
}
