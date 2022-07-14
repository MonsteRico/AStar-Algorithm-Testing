function aStar(start, end) {
	// A* algorithm

	// Create lists of cells to be checked and cells that have been checked
	let openSet = [];
	let closedSet = [];
	let currentCell = start;
	// Add the starting cell to the open set and set its costs
	currentCell.hCost = heuristic(currentCell, end);
	currentCell.gCost = 0;
	currentCell.fCost = heuristic(currentCell, end);
	openSet.push(currentCell);
	while (openSet.length > 0) {
		// Find the cell with the lowest fCost
		currentCell = findLowestFCost(openSet);
		if (currentCell === end) {
			// If the end cell is found, return the path, labeling each cell in the path with path:true
			let path = [];
			let temp = currentCell;
			while (temp.parent) {
				path.push(temp);
				temp = temp.parent;
			}
			path.push(temp);
			path.reverse();
			path.forEach((cell) => {
				cell.path = true;
			});
			return true;
		}
		// Remove the current cell from the open set and add it to the closed set
		openSet.splice(openSet.indexOf(currentCell), 1);
		closedSet.push(currentCell);
		let neighbors = getNeighbors(currentCell);
		neighbors.forEach((neighbor) => {
			if (neighbor.wall) {
				// If the neighbor is a wall ignore it since we can't go there anyways
				return;
			}
			if (closedSet.includes(neighbor)) {
				// If we've already checked this neighbor we can ignore it
				return;
			}
			// Calculate the new gCost for the neighbor
			let tentativeGCost = currentCell.gCost + 1;
			if (neighbor.road) {
				// If the neighbor is a road, we can move there with less cost
				tentativeGCost -= 0.5;
			}
			if (neighbor.mountain) {
				// If the neighbor is a mountain, we can move there with more cost
				tentativeGCost += 0.5;
			}
			// If the open set doesn't contain the neighbor or the new gCost is less than the old gCost, update the neighbor
			if (!openSet.includes(neighbor) || tentativeGCost < neighbor.gCost) {
				neighbor.gCost = tentativeGCost;
				neighbor.fCost = neighbor.gCost + heuristic(neighbor, end);
				neighbor.hCost = heuristic(neighbor, end);
				neighbor.parent = currentCell;
				if (!openSet.includes(neighbor)) {
					openSet.push(neighbor);
				}
			}
		});
	}
	return false;
}

function heuristic(currentCell, goal) {
	// Determines the distance between two cells using a heuristic method
	let distance;
	let xDistance = Math.abs(currentCell.gridX - goal.gridX);
	let yDistance = Math.abs(currentCell.gridY - goal.gridY);
	switch (TYPE) {
		case "Manhattan":
			distance = xDistance + yDistance;
			break;
		case "Euclidean":
			distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
			break;
		case "Djikstra":
			distance = 0;
			break;
	}
	return distance;
}

function findLowestFCost(list) {
	let lowest = list[0];
	let lowestIndex = 0;
	for (let i = 0; i < list.length; i++) {
		if (list[i].fCost < lowest.fCost) {
			lowest = list[i];
			lowestIndex = i;
		}
		if (list[i].fCost == lowest.fCost) {
			if (list[i].hCost < lowest.hCost) {
				lowest = list[i];
				lowestIndex = i;
			}
		}
	}
	return list[lowestIndex];
}

function getNeighbors(cell, diagonal = false) {
	let neighbors = [];
	let row = cell.gridY;
	let col = cell.gridX;
	if (row > 0) {
		neighbors.push(map[row - 1][col]);
		if (diagonal) {
			if (col > 0) {
				neighbors.push(map[row - 1][col - 1]);
			}
			if (col < NUM_COLS - 1) {
				neighbors.push(map[row - 1][col + 1]);
			}
		}
	}
	if (row < NUM_ROWS - 1) {
		neighbors.push(map[row + 1][col]);
		if (diagonal) {
			if (col > 0) {
				neighbors.push(map[row + 1][col - 1]);
			}
			if (col < NUM_COLS - 1) {
				neighbors.push(map[row + 1][col + 1]);
			}
		}
	}
	if (col > 0) {
		neighbors.push(map[row][col - 1]);
	}
	if (col < NUM_COLS - 1) {
		neighbors.push(map[row][col + 1]);
	}

	return neighbors;
}
