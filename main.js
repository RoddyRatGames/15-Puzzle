


// TODO: Add sliding animation to the tiles
// FIXME: Win screen is ugly and text functions are hard-coded

// EXTRA: Add an auto-solver bot using heuristics


// this program simulates a game of the popular 15-puzzle, or sliding block puzzle.
// the puzzle takes place on an n x n grid filled with numbered tiles up to n^2 - 1 (eg. 1-15 on a 4 x 4 grid)
// the grid leaves one tile blank, with the main function of the game being to slide the tiles around one by one.
// the goal of the game is to start with a completely shuffled grid, and slide the numbered tiles back to their
// original positions.
// this program simulates shuffling the board, facilitating gameplay, and displaying the game as it progresses.
// the player can click or drage tiles to slide them into the place of the blank tile to complete the puzzle.
// number keys can be pressed in-game to increase or decrease the size of the playing board for rescaleablility.

// the 15-puzzle was originally designed by Noyes Palmer Chapman in the 1870's
// thanks to zegkljan on stackoverflow for providing an explanation of the scrambling algorithm i used
// https://stackoverflow.com/questions/36593259/a-good-randomizer-for-puzzle-15



const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');



//mouse events

// on click, grab the tile from the mouse position on the game board.
// check if the empty tile is in one of the adjacent tiles. make sure not to check outside of the grid.
// if so, swap the values of the two tiles. increment the turn counter, and print the updated board.
// also on mouse held, mouse movements will check all hovered tiles, adding drag functionality.

let mouseDown = false;

canvas.onmousedown = (e) => {
    if(e.button == 0){
        mouseDown = true;
    }
    if(finishedTiles < gridSize * gridSize){
        moveTile(e);
    }
}

onmouseup = (e) => {
    if(e.button == 0){
        mouseDown = false;
    }
}

canvas.onmousemove = (e) => {
    let xPos = Math.floor((e.clientX - canvas.getBoundingClientRect().left) / tileSize);
    let yPos = Math.floor((e.clientY - canvas.getBoundingClientRect().top) / tileSize);
    if(finishedTiles < gridSize * gridSize){
        if(mouseDown){
            moveTile(e);
        }
        highlightTile(xPos, yPos);
    }
}

function highlightTile(x, y){
    printGrid();
    if(tileGrid[x][y] > 0){
        ctx.beginPath();
        ctx.globalAlpha = 0.25;
        ctx.rect(x * tileSize, y * tileSize, tileSize, tileSize);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}



// onkeydown event

// if a number key from 3 through 0 is pressed, this function will change the board size to 3-10 respectively.

onkeydown = (e) => {
    for(var i = 3; i < 11; i++){
        if(e.code == "Digit" + (i % 10)){
            gridSize = i;
            gameStart();
        }
    }
    if(e.code == "KeyR"){
        gameStart();
    }
}



// important game elements

// gridSize - the number of rows/collumns in the game board.
// goalGrid - a static 2d array that will hold the solved game state.
// tileGrid - a 2d array that will hold the current game state.
// turns - a counter to keep track of how many moves have been made.

let gridSize = 4;
let goalGrid;
let tileGrid;
let finishedTiles;
let turns;
let scrambleFactor = 12;
let startTime;
let finishTime;
let winScreenFade;



// important graphics properties

let tileSize;
let colors = ["#f66d9b", "#9561e2", "#6574cd", "#3490dc", "#4dc0b5", "#38c172", "#ffed4a", "#f6993f", "#e3342f"];
ctx.strokeStyle = "#000000";
ctx.lineWidth = 2;
ctx.textAlign = "center";




// gameStart()

// innitialize the arrays that will be used, then fill them with the solved state.
// scramble the game board and print the board.
// now the only game updates will come from the onmousedown event.

gameStart();

function gameStart(){
    tileSize = canvas.clientHeight / gridSize;
    ctx.font = 0.7 * tileSize + "px Arial";
    winScreenFade = 0;
    turns = 0;
    createGrids();
    fillGrids();
    scrambleGrid();
    checkGrid();
    printGrid();
}



// functions

// moveTile()

// grabs the tile from the mouse position on the game board. check if the empty tile is in one of the
// adjacent tiles. make sure not to check outside of the grid. if so, swap the values of the two tiles.
// increment the turn counter, and print the updated board.

function moveTile(e){
    let xPos = Math.floor((e.clientX - canvas.getBoundingClientRect().left) / tileSize);
    let yPos = Math.floor((e.clientY - canvas.getBoundingClientRect().top) / tileSize);
    if(xPos > -1 && xPos < gridSize - 1 && tileGrid[xPos + 1][yPos] == 0){
        tileGrid[xPos + 1][yPos] = tileGrid[xPos][yPos];
        tileGrid[xPos][yPos] = 0;
        newTurn();
    }
    if(xPos > 0 && xPos < gridSize && tileGrid[xPos - 1][yPos] == 0){
        tileGrid[xPos - 1][yPos] = tileGrid[xPos][yPos];
        tileGrid[xPos][yPos] = 0;
        newTurn();
    }
    if(yPos > -1 && yPos < gridSize - 1 && tileGrid[xPos][yPos + 1] == 0){
        tileGrid[xPos][yPos + 1] = tileGrid[xPos][yPos];
        tileGrid[xPos][yPos] = 0;
        newTurn();
    }
    if(yPos > 0 && yPos < gridSize && tileGrid[xPos][yPos - 1] == 0){
        tileGrid[xPos][yPos - 1] = tileGrid[xPos][yPos];
        tileGrid[xPos][yPos] = 0;
        newTurn();
    }
}



// createGrids()

// this function serves to create the 2d arrays used to hold the two game states.
// it creates an array with a length equal to the number of rows on the game board.
// then, it uses a loop to fill the array with more arrays that represent the columns.
// it innitializes all elements of the 2d array with a value of 0.

function createGrids(){
    goalGrid = Array(gridSize);
    tileGrid = Array(gridSize);
    for(var i = 0; i < gridSize; i++){
       goalGrid[i] = Array(gridSize).fill(0);
       tileGrid[i] = Array(gridSize).fill(0);
    }
}



// fillGrids()

// this function fills the two game state arrays with the intended solved state.
// it uses nested loops to go through each element in the 2d arrays and assign the tile numbers
// it checks the tile number against the product of the rows and columns so that the last tile is left blank.

function fillGrids(){
    let tile = 1;
    for(var i = 0; i < gridSize; i++){
        for(var j = 0; j < gridSize; j++){
            if(tile < gridSize * gridSize){
                tileGrid[j][i] = tile;
                goalGrid[j][i] = tile;
                tile++;
            }
        }
    }
}



// printGrid()

// this function handles the graphics of the game
// whenever the game updates, this function is called. it starts by wiping the board with a light grey color.
// it then uses a nested loop to go through all of the tiles on the board.
// the tile element valued at 0 indicates that it is the blank tile and should not be drawn.
// for every other tile, it draws a rectangle with a thick black outline.
// it checks if tiles in the current game state are in the correct position. if so, they are colored green.
// otherwise, they are colored white. it then draws the number associated with that tile.
// finally, it prints the amount of moves made so far to the console.

function printGrid(){
    ctx.rect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.fillStyle = "#323232";
    ctx.fill();
    for(var i = 0; i < gridSize; i++){
        for(var j = 0; j < gridSize; j++){
            if(tileGrid[i][j] > 0){
                ctx.beginPath();
                ctx.rect(i * tileSize, j * tileSize, tileSize, tileSize);
                colorTile(i, j);
                ctx.fill();
                ctx.stroke();
                if(tileGrid[i][j] == goalGrid[i][j]){
                    ctx.fillStyle = "#ffffff"
                } else{
                    ctx.fillStyle = "#323232";
                }
                ctx.fillText(tileGrid[i][j], (i + 0.475) * tileSize, (j + 0.75) * tileSize);
                ctx.strokeText(tileGrid[i][j], (i + 0.475) * tileSize, (j + 0.75) * tileSize);
            }
        }
    }
    if(finishedTiles == gridSize * gridSize){
        finishTime = Math.floor((Date.now() - startTime)) / 1000;
        winScreen();
    }
}



// newTurn()

function newTurn(){
    turns++;
    if(turns == 1){
        startTime = Date.now();
    }
    checkGrid();
}



//checkGrid()

function checkGrid(){
    finishedTiles = 0;
    for(var i = 0; i < gridSize; i++){
        for(var j = 0; j < gridSize; j++){
            if(tileGrid[i][j] == goalGrid[i][j]){
                finishedTiles++;
            }
        }
    }
}



// winScreen()

function winScreen(){
    let minutes = Math.floor(finishTime / 60);
    let seconds = finishTime % 60
    ctx.globalAlpha = winScreenFade;
    ctx.rect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.font = "40px Arial";
    ctx.globalAlpha = winScreenFade * 5;
    if(minutes > 0){
        ctx.fillText("You finished the puzzle in", 320, 280);
        ctx.fillText(minutes + "m" + seconds + "s and " + turns + " moves.", 320, 280 + 32);
        ctx.strokeText("You finished the puzzle in", 320, 280);
        ctx.strokeText(minutes + "m" + seconds + "s and " + turns + " moves.", 320, 280 + 32);
    
    } else{
        ctx.fillText("You finished the puzzle in", 320, 280);
        ctx.fillText(seconds + "s and " + turns + " moves.", 320, 280 + 40);
        ctx.strokeText("You finished the puzzle in", 320, 280);
        ctx.strokeText(seconds + "s and " + turns + " moves.", 320, 280 + 40);
    }
    ctx.fillText("Press R to play again or press a", 320, 280 + 120);
    ctx.strokeText("Press R to play again or press a", 320, 280 + 120);
    ctx.fillText("number key to change the grid size", 320, 280 + 160);
    ctx.strokeText("number key to change the grid size", 320, 280 + 160);
    ctx.globalAlpha = 1;
    winScreenFade += 0.01;
    if(winScreenFade < 0.2){
        requestAnimationFrame(winScreen);
    }
}



// colorTile()

function colorTile(x, y){
    for(var i = gridSize - 2; i > -1; i--){
        if((i * gridSize < tileGrid[x][y] && tileGrid[x][y] < (i + 1) * gridSize + 1) || tileGrid[x][y] % gridSize == (i + 1)){
            ctx.fillStyle = colors[i];
        }
    }
}



// scrambleGrid()

// this function uses a simple algorithm to shuffle the game board by swapping random pairs on the board.
// if the bottom-right blank tile is not moved, and the amount of swaps made are even, it will be solvable.
// to do this, select one tile by randomly generating the coordinates of a tile on the grid.
// when generating the y coordinate, check to make sure it does not select the bottom-right blank tile.
// when generating the second tile, use a while loop to assure that the second tile is not the same as the first.
// if this happens, the number of permutaions may not be even and the board will be impossible.
// finally, swap the two tiles' values. repeat this process an even number of times as needed.
// i scaled the number of scrambles by the size of the board it is generating and a factor of 12 to be thorough.
// this provided reliable scrambles when tested on 3x3 up to 10x10 boards.

function scrambleGrid(){
    let x1, y1, x2, y2, temp;
    for(var i = 0; i < 2 * scrambleFactor * gridSize; i++){
        x1 = Math.floor(Math.random() * (gridSize));
        if(x1 == gridSize - 1){
            y1 = Math.floor(Math.random() * (gridSize - 1));
        } else{
            y1 = Math.floor(Math.random() * (gridSize));
        }

        do{
            x2 = Math.floor(Math.random() * (gridSize));
            if(x2 == gridSize - 1){
                y2 = Math.floor(Math.random() * (gridSize - 1));
            } else{
                y2 = Math.floor(Math.random() * (gridSize));
            }
        } while((x1 == x2) && (y1 == y2))

        temp = tileGrid[x1][y1];
        tileGrid[x1][y1] = tileGrid[x2][y2];
        tileGrid[x2][y2] = temp;
    }
}