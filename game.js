const CELL_SIZE = 50;
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 800;
const NUM_ROWS = CANVAS_HEIGHT / CELL_SIZE;
const NUM_COLS = CANVAS_WIDTH / CELL_SIZE;

const map = [];
let placing = "play";
let buttonArray = [];
let playerCell = {
	gridX: 0,
	gridY: 0,
	x: 0 * CELL_SIZE,
	y: 0 * CELL_SIZE,
	wall: false,
	start: true,
	end: false,
	fCost: null,
	gCost: null,
	hCost: null,
	neighbor: false,
	path: false,
	parent: null,
	mountain: false,
};
let mouseCell = playerCell;
let TYPE = "Manhattan";
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
				mountain: false,
				road: false,
			};
		}
	}
	map[0][0] = playerCell;
	console.log(map);

	let wallButton = createButton("Wall");
	wallButton.mousePressed(() => {
		placing = "wall";
		highlightButton(wallButton);
	});
	let roadButton = createButton("Road");
	roadButton.mousePressed(() => {
		placing = "road";
		highlightButton(roadButton);
	});
	let mountainButton = createButton("Mountain");
	mountainButton.mousePressed(() => {
		placing = "mountain";
		highlightButton(mountainButton);
	});
	let eraseButton = createButton("Erase");
	eraseButton.mousePressed(() => {
		placing = "none";
		highlightButton(eraseButton);
	});
	let clearButton = createButton("Clear");
	clearButton.mousePressed(() => {
		for (let row = 0; row < NUM_ROWS; row++) {
			for (let col = 0; col < NUM_COLS; col++) {
				map[row][col].wall = false;
				map[row][col].path = false;
				map[row][col].parent = false;
				map[row][col].fCost = null;
				map[row][col].gCost = null;
				map[row][col].hCost = null;
				map[row][col].road = false;
			}
		}
	});
	let playButton = createButton("Play");
	playButton.mousePressed(() => {
		placing = "play";
		highlightButton(playButton);
	});
	playButton.style("background-color", "green");
	let startButton = createButton("Player");
	startButton.mousePressed(() => {
		placing = "start";
		highlightButton(startButton);
	});
	buttonArray.push(wallButton, eraseButton, roadButton, clearButton, playButton, startButton, mountainButton);
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
	mouseCell = map[0][0];
	if (mouseX > 0 && mouseX < CANVAS_WIDTH && mouseY > 0 && mouseY < CANVAS_HEIGHT && placing == "play") {
		let row = Math.floor(mouseY / CELL_SIZE);
		let col = Math.floor(mouseX / CELL_SIZE);
		mouseCell = map[row][col];
	}
	aStar(playerCell, mouseCell);
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
			if (cell.mountain) {
				fill(200);
			}
			if (cell.start) {
				fill(0, 255, 0);
			}
			if (cell.road) {
				fill(0, 255, 255);
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
	map.forEach((row) => {
		row.forEach((cell) => {
			cell.path = false;
			cell.parent = false;
			cell.fCost = null;
			cell.gCost = null;
			cell.hCost = null;
		});
	});
}

function mouseDragged() {
	let col = Math.floor(mouseX / CELL_SIZE);
	let row = Math.floor(mouseY / CELL_SIZE);
	console.log(map[row][col]);
	let cell = map[row][col];
	switch (placing) {
		case "wall":
			resetCell(cell);
			cell.wall = true;
			break;
		case "road":
			resetCell(cell);
			cell.road = true;
			break;
		case "mountain":
			resetCell(cell);
			cell.mountain = true;
			break;
		case "none":
			resetCell(cell);
			break;
		default:
			break;
	}
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
		case "road":
			resetCell(cell);
			cell.road = true;
			break;
		case "mountain":
			resetCell(cell);
			cell.mountain = true;
			break;
		case "none":
			resetCell(cell);
			break;
		case "play":
			resetCell(cell);
			clearStart();
			cell.start = true;
			playerCell = cell;
			break;
		default:
			resetCell(cell);
			clearStart();
			cell.start = true;
			playerCell = cell;
			break;
	}
}

function clearStart() {
	for (let row = 0; row < NUM_ROWS; row++) {
		for (let col = 0; col < NUM_COLS; col++) {
			map[row][col].start = false;
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
	cell.mountain = false;
	cell.path = false;
	cell.road = false;
	cell.parent = false;
}
