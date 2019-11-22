const c = document.querySelector("#myCanvas");
const message = document.querySelector(".message");
const actionBox = document.querySelector(".action-box");
// const lblCounter = document.querySelector(".counter");
const modeSingle = document.querySelector("#mode-single");
const mode2Players = document.querySelector("#mode-2players");
const ZERO = 0, ONE = 1, TWO = 2, THREE = 3, FOUR = 4, FIVE = 5, SIX = 6, SEVEN = 7, EIGHT = 8, NINE = 9, TEN = 10;
const BOARD_SIZE = 450;
const NUM_ROWs = 3;
const SQUARE_SIZE = BOARD_SIZE/NUM_ROWs;
const HALF_SQUARE_SIZE = (SQUARE_SIZE/TWO);


let count = 0;
let gameOver = false;
class Player{
    constructor(name){
        this._name = name;
        this._numWin = ZERO;
        this._squares = [];
    }

    get name(){
        return this._name;
    }

    set name(name){
        this._name = name;
    }

    get numWin(){
        return this._numWin;
    }

    set numWin(n){
        this._numWin = n;
    }

    get squares(){
        return this._squares;
    }

    //check if the player has already chosen the square
    hasSquare(x){
        if(this._squares.length == ZERO){
            return false;
        }
        return this._squares.includes(x);
    }

    //when play click a square
    //add it to his collection
    addSquare(x){
        if(!this.hasSquare(x)){
            console.log("Add Square " + x);
            this._squares.push(x);
            return true;
        }
        return false;
    }

    //reset the game
    clearSquares(){
        this._squares = [];
    }

    //check if the player has won the game
    checkWin(){
        if(this.hasSquare(ONE) && this.hasSquare(TWO) && this.hasSquare(THREE)){
            return true;
        } 
        else if(this.hasSquare(FOUR) && this.hasSquare(FIVE) && this.hasSquare(SIX)){
            return true;
        } 
        else if(this.hasSquare(SEVEN) && this.hasSquare(EIGHT) && this.hasSquare(NINE)){
            return true;
        }
        else if(this.hasSquare(ONE) && this.hasSquare(FOUR) && this.hasSquare(SEVEN)){
            return true;
        }
        else if(this.hasSquare(TWO) && this.hasSquare(FIVE) && this.hasSquare(EIGHT)){
            return true;
        }
        else if(this.hasSquare(THREE) && this.hasSquare(SIX) && this.hasSquare(NINE)){
            return true;
        }
        else if(this.hasSquare(ONE) && this.hasSquare(FIVE) && this.hasSquare(NINE)){
            return true;
        }
        else if(this.hasSquare(THREE) && this.hasSquare(FIVE) && this.hasSquare(SEVEN)){
            return true;
        }
        else{
            return false;
        }
    }

    findWinningMove(opponent_squares) {
        //get all the valid moves
        let validMoves = [];
        if(this._squares.length > ZERO){
            for(let i=1; i<TEN; i++){
                if(!this._squares.includes(i) && !opponent_squares.includes(i)){
                    validMoves.push(i);
                }
            }
        }
        //check if any of the move will give a win
        //if find return the winning move
        for(let m of validMoves){
            this._squares.push(m);
            if(this.checkWin()){
                this._squares.pop();
                return m;
            }
            else{
                this._squares.pop();
            }
        }
        return -1;
    }

    findOpponentWinningMove(opponent_squares){
        //get all the valid moves
        // console.log(opponent_squares);
        let opponent = new Player("Opponent");
        for(let move of opponent_squares){
            opponent.addSquare(move);
        }

        return opponent.findWinningMove(this._squares);
    }

    findNextBestMove(opponent_squares){
        //create a list of cells that hasn't been occupied
        let validMoves = [];
        for(let i=1; i<TEN; i++){
            if(!this._squares.includes(i) && !opponent_squares.includes(i)){
                validMoves.push(i);
            }
        }

        //When the opponent occupied two corner cell that are diagonally
        //opposite to each other
        console.log(opponent_squares);
        if((opponent_squares.includes(THREE) && opponent_squares.includes(SEVEN)) || (opponent_squares.includes(ONE) && opponent_squares.includes(NINE))){
            let moves = validMoves.filter((m) => !(m == ONE || m == THREE || m == SEVEN || m == NINE));
            let r = Math.floor(moves.length*Math.random());
            return moves[r];
        }

        if(!this._squares.includes(NINE) && opponent_squares.includes(EIGHT) && opponent_squares.includes(SIX)){
            return NINE;
        }

        //find the next best move that will give the next winning move
        for(let move of validMoves){
            this._squares.push(move);
            if(this.findWinningMove(opponent_squares) > ZERO){
                this._squares.pop();
                return move;
            }
            else{
                this._squares.pop();
            }
        }
        
        //if no such a move is found
        //just randomly choose a move
        if(validMoves.includes(FIVE)){
            return FIVE;
        }
        else if(validMoves.includes(ONE)){
            return ONE;
        }
        else if(validMoves.includes(THREE)){
            return THREE;
        }
        else if(validMoves.includes(SEVEN)){
            return SEVEN;
        }
        else if(validMoves.includes(NINE)){
            return NINE;
        }
        let r = Math.floor(validMoves.length*Math.random());
        return validMoves[r];
    }

}

let p1 = new Player("Player 1");
let p2 = new Player("Player 2");

function setCanvas() {
    let ctx = c.getContext("2d");
    // ctx.beginPath();
    // ctx.arc(100, HALF_SQUARE_SIZE, 50, ZERO, 2 * Math.PI);
    // ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ZERO, SQUARE_SIZE);
    ctx.lineTo(BOARD_SIZE, SQUARE_SIZE);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ZERO, (SQUARE_SIZE*TWO));
    ctx.lineTo(BOARD_SIZE, (SQUARE_SIZE*TWO));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(SQUARE_SIZE, ZERO);
    ctx.lineTo(SQUARE_SIZE, BOARD_SIZE);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo((SQUARE_SIZE*TWO), ZERO);
    ctx.lineTo((SQUARE_SIZE*TWO), BOARD_SIZE);
    ctx.stroke();
    
    //display a message
    message.innerHTML = "Welcome to Tick Jack's Toe<br>";
    message.innerHTML += p1.name + " can start";
}

//Draw something in response to the click
function draw(e){

    let s = getSquareNo(e.pageX, e.pageY);
    if(count == ZERO){
        modeSingle.disabled = true;
        mode2Players.disabled = true;
    }
    
    if(s > ZERO && s < TEN && !gameOver && count < NINE){
        // console.log(e.pageX + " " + e.pageY);
        // let xy = getSquareCenterXY(e.pageX, e.pageY);
        let xy = getSquareCenterXY(s);
        let x = xy[ZERO];
        let y = xy[1];

        if (!(p1.hasSquare(s) || p2.hasSquare(s))){
            if(count%2 == ZERO){
                if(p1.addSquare(s)){
                    count += 1;
                    // lblCounter.innerHTML = "Counter: " + count;
                    drawCircle(x, y);
                    if(p1.checkWin()){
                        message.innerHTML = p1.name + " has won the game!!!";
                        gameOver = true;
                    }
                    else{
                        message.innerHTML = p2.name + "'s turn";
                        if(count < NINE && modeSingle.checked){
                            botPlay();
                        }
                    }   
                }
            }
            else{   
                if(p2.addSquare(s)){
                    count += 1;
                    drawX(x, y);
                    if(p2.checkWin()){
                        message.innerHTML = p2.name + " has won the game!!!";
                        gameOver = true;
                        // showButton();
                    }
                    else{
                        message.innerHTML = p1.name + "'s turn";
                    }
                }
            }
        }else{
            message.innerHTML = "It's taken!!  Try again.";
        }
    }
    else{
        message.innerHTML = "It's taken!!  Try again.";
    }
    if(count == NINE){
        message.innerHTML = "Draw!!";
        gameOver = true;
        showButton();
    } else if(gameOver){
        // message.innerHTML = "Draw!!";
        // gameOver = true;
        showButton();
    }
}

function showButton(){
    let playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Play again!";
    playAgainButton.id = "playAgainButton";
    playAgainButton.className = "playAgainButton";
    playAgainButton.addEventListener("click", resetGame);
    c.removeEventListener("click", draw, true);
    actionBox.appendChild(playAgainButton);
}

function drawCircle(x, y){
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(x, y, 25, ZERO, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    // ctx.stroke();
}

function drawX(x, y){
    let ctx = c.getContext("2d");
    ctx.beginPath();

    ctx.moveTo(x - 20, y - 20);
    ctx.lineTo(x + 20, y + 20);

    ctx.moveTo(x + 20, y - 20);
    ctx.lineTo(x - 20, y + 20);
    ctx.stroke();
}

function resetGame(){
    let ctx = c.getContext("2d");
    ctx.clearRect(ZERO, ZERO, BOARD_SIZE, BOARD_SIZE);
    setCanvas();
    count = ZERO;
    gameOver = false;
    modeSingle.disabled = false;
    mode2Players.disabled = false;
    p1.clearSquares();
    p2.clearSquares();
    let playAgainButton = document.querySelector("#playAgainButton");
    actionBox.removeChild(playAgainButton);
    c.addEventListener("click", draw, true);
}

//matching the X, Y coordinate to the square block
function getSquareNo(x, y){
    if (x < SQUARE_SIZE && y < SQUARE_SIZE){
        return ONE;
    }
    else if(x < (SQUARE_SIZE*TWO) && x > SQUARE_SIZE && y < SQUARE_SIZE){
        return TWO;
    }
    else if(x < BOARD_SIZE && x > (SQUARE_SIZE*TWO) && y < SQUARE_SIZE){
        return THREE;
    }
    else if(x < SQUARE_SIZE && y > SQUARE_SIZE && y < (SQUARE_SIZE*TWO)){
        return FOUR;
    }
    else if(x > SQUARE_SIZE && x < (SQUARE_SIZE*TWO) && y > SQUARE_SIZE && y < (SQUARE_SIZE*TWO)){
        return FIVE;
    }
    else if(x > (SQUARE_SIZE*TWO) && x < BOARD_SIZE && y > SQUARE_SIZE && y < (SQUARE_SIZE*TWO)){
        return SIX;
    }
    else if(x > ZERO && x < SQUARE_SIZE && y > (SQUARE_SIZE*TWO) && y < BOARD_SIZE){
        return SEVEN;
    }
    else if(x > SQUARE_SIZE && x < (SQUARE_SIZE*TWO) && y > (SQUARE_SIZE*TWO) && y < BOARD_SIZE){
        return EIGHT;
    }
    else if(x > (SQUARE_SIZE*TWO) && x < BOARD_SIZE && y > (SQUARE_SIZE*TWO) && y < BOARD_SIZE){
        return NINE;
    }
    else{
        return -1;
    }
}

//getting the X, Y coordinate of the center of the square
function getSquareCenterXY(s){
    if (s === ONE){
        return [HALF_SQUARE_SIZE, HALF_SQUARE_SIZE];
    }
    else if(s === TWO){
        return [(SQUARE_SIZE + HALF_SQUARE_SIZE), HALF_SQUARE_SIZE];
    }
    else if(s === THREE){
        return [((TWO*SQUARE_SIZE) + HALF_SQUARE_SIZE), HALF_SQUARE_SIZE];
    }
    else if(s === FOUR){
        return [HALF_SQUARE_SIZE, (SQUARE_SIZE + HALF_SQUARE_SIZE)];
    }
    else if(s === FIVE){
        return [(SQUARE_SIZE + HALF_SQUARE_SIZE), (SQUARE_SIZE + HALF_SQUARE_SIZE)];
    }
    else if(s === SIX){
        return [((TWO*SQUARE_SIZE) + HALF_SQUARE_SIZE), (SQUARE_SIZE + HALF_SQUARE_SIZE)];
    }
    else if(s === SEVEN){
        return [HALF_SQUARE_SIZE, ((TWO*SQUARE_SIZE) + HALF_SQUARE_SIZE)];
    }
    else if(s === EIGHT){
        return [(SQUARE_SIZE + HALF_SQUARE_SIZE), ((TWO*SQUARE_SIZE) + HALF_SQUARE_SIZE)];
    }
    else if(s === NINE){
        return [((TWO*SQUARE_SIZE) + HALF_SQUARE_SIZE), ((TWO*SQUARE_SIZE) + HALF_SQUARE_SIZE)];
    }
    else{//if the input number is invalide, it would return [0,0]
        return [ZERO, ZERO];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function botPlay(){
    c.removeEventListener("click", draw, true);
    let move = p2.findWinningMove(p1.squares);
    // console.log(move);
    if(move > ZERO){
        //make the winning move
        botMove(move);
    }else{
        //block the opponent
        move = p2.findOpponentWinningMove(p1.squares);
        if(move > ZERO){
            botMove(move);
        }
        else{
            move = p2.findNextBestMove(p1.squares);
            console.log("Next best move " + move);
            botMove(move);
        }
    }
    if(count == NINE){
        message.innerHTML = "Draw!!";
        gameOver = true;
        showButton();
    }
}

async function botMove(m){
    console.log(m);
    sleep(2000);
    
    if(p2.addSquare(m)){
        count += 1;
        // lblCounter.innerHTML = "Counter: " + count;
        let xy = getSquareCenterXY(m);
        let x = xy[0];
        let y = xy[1];

        drawX(x, y);
        if(p2.checkWin()){
            message.innerHTML = p2.name + " has won the game!!!";
            gameOver = true;
            // showButton();
        }
        else{
            message.innerHTML = p1.name + "'s turn";
        }
    }
    else{
        console.log("Something is wrong.");
        console.log(p2.squares);
    }
    c.addEventListener("click", draw, true);
}

c.addEventListener("click", draw, true);
setCanvas();
