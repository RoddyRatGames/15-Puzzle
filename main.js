// this program simulates a game of the popular 15-puzzle, or sliding block puzzle.
// the puzzle takes place on an n x n grid filled with numbered tiles up to n^2 - 1 (eg. 1-15 on a 4 x 4 grid)
// the grid leaves one tile blank, with the main function of the game being to slide the tiles around one by one.
// the goal of the game is to start with a completely shuffled grid, and slide the numbered tiles back to their
// original positions.
// this program simulates shuffling the board, facilitating gameplay, and displaying the game as it progresses.
// the player can click on the numbered tiles to slide them into the place of the blank tile to complete the puzzle.
// number keys can be pressed in-game to increase or decrease the size of the playing board for rescaleablility.

// the 15-puzzle was originally designed by Noyes Palmer Chapman in the 1870's
// thanks to zegkljan on stackoverflow for providing an explanation of the scrambling algorithm i used
// https://stackoverflow.com/questions/36593259/a-good-randomizer-for-puzzle-15



const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');



// onkeydown event

// if a number key from 3 through 0 is pressed, this function will change the board size to 3-10 respectively.

onkeydown = (e) => {
    if(e.code == "Digit3"){
        boardSize = 3;
        gameStart();
    }
    if(e.code == "Digit4"){
        boardSize = 4;
        gameStart();
    }
    if(e.code == "Digit5"){
        boardSize = 5;
        gameStart();
    }
    if(e.code == "Digit6"){
        boardSize = 6;
        gameStart();
    }
    if(e.code == "Digit7"){
        boardSize = 7;
        gameStart();
    }
    if(e.code == "Digit8"){
        boardSize = 8;
        gameStart();
    }
    if(e.code == "Digit9"){
        boardSize = 9;
        gameStart();
    }
    if(e.code == "Digit0"){
        boardSize = 10;
        gameStart();
    }
}



//onmousedown event

// on click, grab the tile from the mouse position on the game board.
// check if the empty tile is in one of the adjacent tiles. make sure not to check outside of the grid.
// if so, swap the values of the two tiles.
// increment the turn counter, and print the updated board.

onmousedown = (e) => {
    let xPos = Math.floor((e.clientX - canvas.getBoundingClientRect().left) / tileSize);
    let yPos = Math.floor((e.clientY - canvas.getBoundingClientRect().top) / tileSize);
    if(xPos < boardSize - 1 && gameBoard[xPos + 1][yPos] == 0){
        gameBoard[xPos + 1][yPos] = gameBoard[xPos][yPos];
        gameBoard[xPos][yPos] = 0;
        turns++;
        printBoard();
    }
    if(xPos > 0 && gameBoard[xPos - 1][yPos] == 0){
        gameBoard[xPos - 1][yPos] = gameBoard[xPos][yPos];
        gameBoard[xPos][yPos] = 0;
        turns++;
        printBoard();
    }
    if(yPos < boardSize - 1 && gameBoard[xPos][yPos + 1] == 0){
        gameBoard[xPos][yPos + 1] = gameBoard[xPos][yPos];
        gameBoard[xPos][yPos] = 0;
        turns++;
        printBoard();
    }
    if(yPos > 0 && gameBoard[xPos][yPos - 1] == 0){
        gameBoard[xPos][yPos - 1] = gameBoard[xPos][yPos];
        gameBoard[xPos][yPos] = 0;
        turns++;
        printBoard();
    }
};



// important game elements

// boardSize - the number of rows/collumns in the game board.
// solvedBoard - a static 2d array that will hold the solved game state.
// gameBoard - a 2d array that will hold the current game state.
// turns - a counter to keep track of how many moves have been made.

let boardSize = 4;
let solvedBoard;
let gameBoard;
let turns;
let scrambleFactor = 12;



// important graphics properties

let tileSize;
ctx.lineWidth = 4;
ctx.strokeStyle = "#000000";
ctx.textAlign = "center";



// game start

// innitialize the arrays that will be used, then fill them with the solved state.
// scramble the game board and print the board.
// now the only game updates will come from the onmousedown event.
gameStart();

function gameStart(){
    turns = 0;
    createBoards();
    fillBoards();
    scrambleBoard();
    printBoard();
}



// functions

// createBoards()

// this function serves to create the 2d arrays used to hold the two game states.
// it creates an array with a length equal to the number of rows on the game board.
// then, it uses a loop to fill the array with more arrays that represent the columns.
// it innitializes all elements of the 2d array with a value of 0.

function createBoards(){
    solvedBoard = Array(boardSize);
    gameBoard = Array(boardSize);
    for(var i = 0; i < boardSize; i++){
       solvedBoard[i] = Array(boardSize).fill(0);
       gameBoard[i] = Array(boardSize).fill(0);
    }
}



// fillBoards()

// this function fills the two game state arrays with the intended solved state.
// it uses nested loops to go through each element in the 2d arrays and assign the tile numbers
// it checks the tile number against the product of the rows and columns so that the last tile is left blank.

function fillBoards(){
    let tile = 1;
    for(var i = 0; i < boardSize; i++){
        for(var j = 0; j < boardSize; j++){
            if(tile < boardSize * boardSize){
                gameBoard[j][i] = tile;
                solvedBoard[j][i] = tile;
                tile++;
            }
        }
    }
}



// printBoard()

// this function handles the graphics of the game
// whenever the game updates, this function is called. it starts by wiping the board with a light grey color.
// it then uses a nested loop to go through all of the tiles on the board.
// the tile element valued at 0 indicates that it is the blank tile and should not be drawn.
// for every other tile, it draws a rectangle with a thick black outline.
// it checks if tiles in the current game state are in the correct position. if so, they are colored green.
// otherwise, they are colored white. it then draws the number associated with that tile.
// finally, it prints the amount of moves made so far to the console.

function printBoard(){
    ctx.rect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.fillStyle = "#323232";
    ctx.fill();
    tileSize = canvas.clientHeight / boardSize;
    ctx.font = 0.8 * tileSize + "px Brush Script MT";
    for(var i = 0; i < boardSize; i++){
        for(var j = 0; j < boardSize; j++){
            if(gameBoard[i][j] > 0){
                ctx.beginPath();
                ctx.rect(i * tileSize, j * tileSize, tileSize, tileSize);
                if(gameBoard[i][j] == solvedBoard[i][j]){
                    ctx.fillStyle = "#00ffff";
                } else{
                    ctx.fillStyle = "#ffffff";
                }
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = "#000000";
                ctx.fillText(gameBoard[i][j], (i + 0.45) * tileSize, (j + 0.8) * tileSize);
            }
        }
    }

    if(turns == 1){
        console.log("1 move");
    } else{
        console.log(turns + " moves");
    }
}



// scrambleBoard()

// this function uses a simple algorithm to shuffle the game board by swapping random pairs on the board.
// if the bottom-right blank tile is not moved, and the amount of swaps made are even, it will be solvable.
// to do this, select one tile by randomly generating the coordinates of a tile on the grid.
// when generating the y coordinate, check to make sure it does not select the bottom-right blank tile.
// when generating the second tile, use a while loop to assure that the second tile is not the same as the first.
// if this happens, the number of permutaions may not be even and the board will be impossible.
// finally, swap the two tiles' values. repeat this process an even number of times as needed.
// i scaled the number of scrambles by the size of the board it is generating and a factor of 12 to be thorough.
// this provided reliable scrambles when tested on 3x3 up to 10x10 boards.

function scrambleBoard(){
    let x1, y1, x2, y2, temp;
    for(var i = 0; i < 2 * scrambleFactor * boardSize; i++){
        x1 = Math.floor(Math.random() * (boardSize));
        if(x1 == boardSize - 1){
            y1 = Math.floor(Math.random() * (boardSize - 1));
        } else{
            y1 = Math.floor(Math.random() * (boardSize));
        }

        do{
            x2 = Math.floor(Math.random() * (boardSize));
            if(x2 == boardSize - 1){
                y2 = Math.floor(Math.random() * (boardSize - 1));
            } else{
                y2 = Math.floor(Math.random() * (boardSize));
            }
        } while((x1 == x2) && (y1 == y2))

        temp = gameBoard[x1][y1];
        gameBoard[x1][y1] = gameBoard[x2][y2];
        gameBoard[x2][y2] = temp;
    }
}