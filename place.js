const CELL_SIZE = 50;
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 800;
const NUM_ROWS = CANVAS_HEIGHT / CELL_SIZE;
const NUM_COLS = CANVAS_WIDTH / CELL_SIZE;

let TYPE = "Manhattan";
const map = [];
let placing = "start";
let buttonArray = [];
let startCell = null;
let endCell = null;

function setup() {
	// put setup code here
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

	for (let row = 0; row < NUM_ROWS; row++) {
		map[row] = [];
		for (let col = 0; col < NUM_COLS; col++) {
			map[row][col] = {
				gridX: col,
				gridY: row,
				x: col * CELL_SIZE,
				y: row * CELL_SIZE,
				wall: false,
				start: false,
				end: false,
				fCost: null,
				gCost: null,
				hCost: null,
				neighbor: false,
				path: false,
				parent: null,
			};
		}
	}
	console.log(map);

	let wallButton = createButton("Wall");
	wallButton.mousePressed(() => {
		placing = "wall";
		highlightButton(wallButton);
	});
	let startButton = createButton("Start");
	startButton.mousePressed(() => {
		placing = "start";
		highlightButton(startButton);
	});
	let endButton = createButton("End");
	endButton.mousePressed(() => {
		placing = "end";
		highlightButton(endButton);
	});
	let eraseButton = createButton("Erase");
	eraseButton.mousePressed(() => {
		placing = "none";
		highlightButton(eraseButton);
	});
	startButton.style("background-color", "green");
	let clearButton = createButton("Clear");
	clearButton.mousePressed(() => {
		for (let row = 0; row < NUM_ROWS; row++) {
			for (let col = 0; col < NUM_COLS; col++) {
				map[row][col].wall = false;
				map[row][col].start = false;
				map[row][col].end = false;
				map[row][col].neighbor = false;
				map[row][col].fCost = null;
				map[row][col].gCost = null;
				map[row][col].hCost = null;
				map[row][col].path = false;
				map[row][col].parent = false;
			}
		}
	});
	let runButton = createButton("Run A* Algorithm");
	runButton.mousePressed(() => {
		for (let row = 0; row < NUM_ROWS; row++) {
			for (let col = 0; col < NUM_COLS; col++) {
				map[row][col].fCost = null;
				map[row][col].gCost = null;
				map[row][col].hCost = null;
				map[row][col].path = false;
				map[row][col].parent = false;
			}
		}
		aStar(startCell, endCell);
	});
	buttonArray.push(wallButton, startButton, endButton, eraseButton, clearButton);
	// create radio buttons to select heuristic
	let radio = createRadio();
	radio.option("Manhattan");
	radio.option("Euclidean");
	radio.option("Djikstra");
	radio.changed(() => {
		TYPE = radio.value();
	});
	radio.selected("Manhattan");
}

function draw() {
	background(220);
	map.forEach((row) => {
		row.forEach((cell) => {
			fill(255);
			if (cell.wall) {
				fill(100);
			}
			if (cell.path) {
				fill(0, 0, 255);
			}
			if (cell.start) {
				fill(0, 255, 0);
			}

			if (cell.end) {
				fill(255, 255, 0);
			}

			rect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);
			if (cell.fCost) {
				fill(0);
				text("f: " + cell.fCost, cell.x + CELL_SIZE / 2 - 10, cell.y + CELL_SIZE / 2 - 10);
				fill(50);
				text("g: " + cell.gCost, cell.x + CELL_SIZE / 2 - 10, cell.y + CELL_SIZE / 2 + 10);
				fill(100);
				text("h: " + cell.hCost, cell.x + CELL_SIZE / 2 - 10, cell.y + CELL_SIZE / 2);
			}
		});
	});
}

function mouseClicked() {
	let col = Math.floor(mouseX / CELL_SIZE);
	let row = Math.floor(mouseY / CELL_SIZE);
	console.log(map[row][col]);
	let cell = map[row][col];
	switch (placing) {
		case "wall":
			resetCell(cell);
			cell.wall = true;
			break;
		case "start":
			resetCell(cell);
			clearStart();
			cell.start = true;
			startCell = cell;
			break;
		case "end":
			resetCell(cell);
			clearEnd();
			cell.end = true;
			endCell = cell;
			break;
		default:
			resetCell(cell);
			break;
	}
}

function mouseDragged() {
	mouseClicked();
}

function clearStart() {
	for (let row = 0; row < NUM_ROWS; row++) {
		for (let col = 0; col < NUM_COLS; col++) {
			map[row][col].start = false;
		}
	}
}

function clearEnd() {
	for (let row = 0; row < NUM_ROWS; row++) {
		for (let col = 0; col < NUM_COLS; col++) {
			map[row][col].end = false;
		}
	}
}

function highlightButton(button) {
	let buttons = buttonArray;
	for (let i = 0; i < buttons.length; i++) {
		buttons[i].style("background-color", "lightgray");
	}
	button.style("background-color", "green");
}

function resetCell(cell) {
	cell.wall = false;
	cell.start = false;
	cell.end = false;
}
