// Board Defaults
const columns = 7;
const rows = 6;
const squareSize = 100;
const outerBorder = 3;
const innerBorder = 3;

// Canvas
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Game Variables
let isPlayer1 = true;
let boardArray = new Array(columns*rows).fill(0);
let winConditionCount = 0;

// Setup Canvas Size
context.canvas.width = columns * squareSize + outerBorder * 2;
context.canvas.height = rows * squareSize + outerBorder * 2;

// Draw Boarder (Fill Entire Canvas)
context.fillStyle = 'white';
context.fillRect(0, 0, squareSize * columns + outerBorder * 2, squareSize * rows + outerBorder * 2);

// Draw Back Fill (Fill Canvas, except border)
context.fillStyle = '#000088';
context.fillRect(outerBorder, outerBorder, squareSize * columns, squareSize * rows);

// Draw Grid Fill (Fill each grid square keeping a border)
context.fillStyle = '#0000cc';
for(let i = 0; i < rows; i++){
	for(let j = 0; j < columns; j++){
		context.fillRect(outerBorder + innerBorder + j * squareSize, outerBorder + innerBorder + i * squareSize, squareSize - innerBorder * 2, squareSize - innerBorder * 2);
	}
}

// Draw all circles (Create a circle with a border and shadow in a grid square)
for(let i = 0; i < rows; i++){
	for(let j = 0; j < columns; j++){
		context.beginPath();
		context.arc(outerBorder + j * squareSize + squareSize / 2, outerBorder + i * squareSize + squareSize / 2, squareSize / 2 - innerBorder * 2, 0, 2 * Math.PI);
		context.shadowColor = 'black';
		context.shadowBlur = 10;
		context.fillStyle = '#cccccc';
		context.fill();
		context.closePath();
		context.lineWidth = 1;
		context.strokeStyle = '#000000';
		context.stroke();
		context.shadowColor='rgba(0,0,0,0)';
	}
}

// Mark Clicked Function
function clicked(x,y,turn){
	context.beginPath();
	context.arc(outerBorder + x * squareSize + squareSize / 2, outerBorder + y * squareSize + squareSize / 2, squareSize / 2 - innerBorder * 2, 0, 2 * Math.PI);
	if(turn){
		context.fillStyle = '#ff0000';
		boardArray[x + columns * y] = 1;
	} else {
		context.fillStyle = '#ffff00';
		boardArray[x + columns * y] = 2;
	}
	context.fill();
	context.closePath();
}

// Win condition helper (Count Right)
function countRight(x,y){
	for(let i = x; i < columns - 1; i++){
		if(boardArray[x + y * columns] == boardArray[(i + 1) + y * columns]){
			winConditionCount++;
		} else {
			return;
		}
	}
}

// Win condition helper (Count Left)
function countLeft(x,y){
	for(let i = x; i > 0; i--){
		if(boardArray[x + y * columns] == boardArray[(i - 1) + y * columns]){
			winConditionCount++;
		} else {
			return;
		}
	}
}

// Win condition helper (Count Down)
function countDown(x,y){
	for(let i = y; i < rows - 1; i++){
		if(boardArray[x + y * columns] == boardArray[x + (i + 1) * columns]){
			winConditionCount++;
		} else {
			return;
		}
	}
}

// Win condition helper (Count Up/Right)
function countUpRight(x,y){
	for(let i = y; i > 0; i--){
		for(let j = x; j < columns - 1; j++){
			if(boardArray[x + y * columns] == boardArray[(j + 1) + (i - 1) * columns]){
				winConditionCount++;
			} else {
				return;
			}
			if(i - 1 > 0){
				i--;
			} else {
				return;
			}
		}
	}
}

// Win condition helper (Count Up/Left)
function countUpLeft(x,y){
	for(let i = y; i > 0; i--){
		for(let j = x; j > 0; j--){
			if(boardArray[x + y * columns] == boardArray[(j - 1) + (i - 1) * columns]){
				winConditionCount++;
			} else {
				return;
			}
			if(i - 1 > 0){
				i--;
			} else {
				return;
			}
		}
	}
}
// Win condition helper (Count Down/Right)
function countDownRight(x,y){
	for(let i = y; i < rows - 1; i++){
		for(let j = x; j < columns - 1; j++){
			if(boardArray[x + y * columns] == boardArray[(j + 1) + (i + 1) * columns]){
				winConditionCount++;
			} else {
				return;
			}
			if(i + 1 < rows - 1){
				i++;
			} else {
				return;
			}
		}
	}
}

// Win condition helper (count Down/Left)
function countDownLeft(x,y){
	for(let i = y; i < rows - 1; i++){
		for(let j = x; j > 0; j--){
			if(boardArray[x + y * columns] == boardArray[(j - 1) + (i + 1) * columns]){
				winConditionCount++;
			} else {
				return;
			}
			if(i + 1 < rows - 1){
				i++;
			} else {
				return;
			}
		}
	}
}

// Check if the win condition has been met.
function checkWinCondition(x,y){
	// Check Right & Left
	winConditionCount = 0;
	countRight(x,y);
	countLeft(x,y);
	if(winConditionCount >= 3){
		return true;
	};
	// Check Down
	winConditionCount = 0;
	countDown(x,y);
	if(winConditionCount >= 3){
		return true;
	}
	// Check Up/Right & Down/Left
	winConditionCount = 0;
	countUpRight(x,y);
	countDownLeft(x,y);
	if(winConditionCount >= 3){
		return true;
	}
	// Check Up/Left & Down/Right
	winConditionCount = 0;
	countUpLeft(x,y);
	countDownRight(x,y);
	if(winConditionCount >= 3){
		return true;
	}
	return false;
}

// Display Winner
function showWinner(){
	context.font = '100px Comic Sans MS';
	context.fillStyle = 'gold';
	context.strokeStyle = 'black';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.lineWidth = 3;
	context.shadowColor = 'black';
	context.shadowBlur = 10;
	if(isPlayer1){
		context.fillText('Red Wins!', context.canvas.width/2, context.canvas.height/2);
		context.strokeText('Red Wins!', context.canvas.width/2, context.canvas.height/2);
	} else {
		context.fillText('Yellow Wins!', context.canvas.width/2, context.canvas.height/2);
		context.strokeText('Yellow Wins!', context.canvas.width/2, context.canvas.height/2);
	}
	context.shadowColor='rgba(0,0,0,0)';
}

// Find the top unused circle of a given column
function findTopRow(x){
	for(let i = 0; i < rows; i++){
		if(boardArray[x + columns * i] != 0){
			return i-1;
		} else if(i == rows - 1){
			return i;
		}
	}
	return -1;
}

// Setup Click Events
canvas.onclick = function(e){
	let bounds = canvas.getBoundingClientRect();
	let x = e.clientX - bounds.left;
	let y = e.clientY - bounds.top;
	let hoverX = Math.floor((x - outerBorder) / squareSize);
	let hoverY = Math.floor((y - outerBorder) / squareSize);
	let adjustedX = hoverX;
	let adjustedY = findTopRow(hoverX);
	clicked(adjustedX,adjustedY,isPlayer1);
	if(checkWinCondition(adjustedX,adjustedY)){
		showWinner();
		canvas.onclick = null;
	} else {
		isPlayer1 = !isPlayer1;
	}
}