// Board Defaults
const columns = 7;
const rows = 6;
const squareSize = 100;
const outerBorder = 3;
const innerBorder = 3;
const desiredFPS = 30;
const animationSpeed = 0.75;
const outerBorderColor = 'white';
const innerBorderColor = '#000088';
const gridSquareColor = '#0000cc';
const player1Color = '#ff0000';
const player2Color = '#ffff00';
const player1ColorDark = '#cc0000';
const player2ColorDark = '#cccc00';
const emptyCircleColor = '#cccccc';

// Canvas
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Game Variables
let isPlayer1 = true;
let boardArray = new Array(columns*rows).fill(0);
let winConditionCount = 0;
let clickedTile_X = 0;
let clickedTile_Y = 0;
let newCircle_X = 0;
let newCircle_Y = 0;
let target_X = 0;
let target_Y = 0;
let moving = false;
let hasWinner = false;

// Setup Canvas Size
context.canvas.width = columns * squareSize + outerBorder * 2;
context.canvas.height = rows * squareSize + outerBorder * 2;

// Render Gameboard & Animations
function splat(){
	context.clearRect(0,0,context.canvas.width,context.canvas.height);
	drawGridCircles();
	drawAnimatedCircle();
	drawGridSquares();
	drawInnerBorder();
	drawOuterBorder();
	showWinner();
}
setInterval(splat,1000/desiredFPS);

// Draw Boarder (Fill Entire Canvas)
function drawOuterBorder(){
	context.globalCompositeOperation = 'destination-over';
	context.fillStyle = outerBorderColor;
	context.fillRect(0, 0, squareSize * columns + outerBorder * 2, squareSize * rows + outerBorder * 2);
	context.globalCompositeOperation = 'source-over';
}

// Draw Back Fill (Fill Canvas, except border)
function drawInnerBorder(){
	context.globalCompositeOperation = 'destination-over';
	context.fillStyle = innerBorderColor;
	context.fillRect(outerBorder, outerBorder, squareSize * columns, squareSize * rows);
	context.globalCompositeOperation = 'source-over';
}

// Draw Grid Fill (Fill each grid square keeping a border)
function drawGridSquares(){
	context.globalCompositeOperation = 'destination-over';
	context.fillStyle = gridSquareColor;
	for(let i = 0; i < rows; i++){
		for(let j = 0; j < columns; j++){
			context.fillRect(outerBorder + innerBorder + j * squareSize, outerBorder + innerBorder + i * squareSize, squareSize - innerBorder * 2, squareSize - innerBorder * 2);
		}
	}
	context.globalCompositeOperation = 'source-over';
}

function drawACircle(x,y,size,Player,Color1,Color2,bAtop=false){
	if(bAtop){
		context.globalCompositeOperation = 'source-atop';
	}
	context.lineWidth = 1;
	context.shadowBlur = 10;
	context.shadowColor = 'black';
	context.strokeStyle = 'black';
	if(Player == 1){
		context.fillStyle = Color1;
	} else if(Player == 2){
		context.fillStyle = Color2;
	} else {
		context.fillStyle = emptyCircleColor;
	}
	context.beginPath();
	context.arc(x, y, size, 0, 2 * Math.PI);
	context.closePath();
	context.fill();
	context.stroke();
	context.shadowColor='rgba(0,0,0,0)';
	context.globalCompositeOperation = 'source-over';
}

// Draw all circles (Create a circle with a border and shadow in a grid square)
function drawGridCircles(){
	let tmpBoardArrayVal = 0;
	for(let i = 0; i < rows; i++){
		for(let j = 0; j < columns; j++){
			tmpBoardArrayVal = boardArray[j + columns * i];
			drawACircle(outerBorder + j * squareSize + squareSize / 2, outerBorder + i * squareSize + squareSize / 2, squareSize / 2 - innerBorder * 2, tmpBoardArrayVal, player1Color, player2Color);
			if(tmpBoardArrayVal != 0){
				drawACircle(outerBorder + j * squareSize + squareSize / 2, outerBorder + i * squareSize + squareSize / 2, squareSize / 3 - innerBorder * 2, tmpBoardArrayVal, player1ColorDark, player2ColorDark);
			}
		}
	}
}

// Draw a new animated cicle
function drawAnimatedCircle(){
	if(moving){
		drawACircle(newCircle_X, newCircle_Y, squareSize / 2 - innerBorder * 2, isPlayer1 ? 1 : 2, player1Color, player2Color, true);
		drawACircle(newCircle_X, newCircle_Y, squareSize / 3 - innerBorder * 2, isPlayer1 ? 1 : 2, player1ColorDark, player2ColorDark, true);
		newCircle_Y = Math.min(target_Y,newCircle_Y + animationSpeed * desiredFPS);
		if(newCircle_Y == target_Y){
			moving = false;
			if(isPlayer1){
				boardArray[clickedTile_X + columns * clickedTile_Y] = 1;
			} else {
				boardArray[clickedTile_X + columns * clickedTile_Y] = 2;
			}
			if(checkWinCondition(clickedTile_X,clickedTile_Y)){
				canvas.onclick = null;
			} else {
				isPlayer1 = !isPlayer1;
			}
		}
	}
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
		hasWinner = true;
		return true;
	};
	// Check Down
	winConditionCount = 0;
	countDown(x,y);
	if(winConditionCount >= 3){
		hasWinner = true;
		return true;
	}
	// Check Up/Right & Down/Left
	winConditionCount = 0;
	countUpRight(x,y);
	countDownLeft(x,y);
	if(winConditionCount >= 3){
		hasWinner = true;
		return true;
	}
	// Check Up/Left & Down/Right
	winConditionCount = 0;
	countUpLeft(x,y);
	countDownRight(x,y);
	if(winConditionCount >= 3){
		hasWinner = true;
		return true;
	}
	return false;
}

// Display Winner
function showWinner(){
	if(hasWinner){
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
	if(!moving){
		let bounds = canvas.getBoundingClientRect();
		let x = e.clientX - bounds.left;
		let y = e.clientY - bounds.top;
		let hoverX = Math.floor((x - outerBorder) / squareSize);
		let hoverY = Math.floor((y - outerBorder) / squareSize);
		clickedTile_X = hoverX;
		clickedTile_Y = findTopRow(hoverX);
		newCircle_X = outerBorder + clickedTile_X * squareSize + squareSize / 2;
		newCircle_Y = 0 - squareSize / 2;
		target_X = newCircle_X;
		target_Y = outerBorder + clickedTile_Y * squareSize + squareSize / 2;
		moving = true;
	}
}