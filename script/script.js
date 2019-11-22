const c = document.querySelector("#myCanvas");
const message = document.querySelector(".message");
const actionBox = document.querySelector(".action-box");
const lblCounter = document.querySelector(".counter");
const modeSingle = document.querySelector("#mode-single");
const mode2Players = document.querySelector("#mode-2players");

let count = 0;
let gameOver = false;
class Player{
    constructor(name){
        this._name = name;
        this._numWin = 0;
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
        if(this._squares.length == 0){
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
        if(this.hasSquare(1) && this.hasSquare(2) && this.hasSquare(3)){
            return true;
        } 
        else if(this.hasSquare(4) && this.hasSquare(5) && this.hasSquare(6)){
            return true;
        } 
        else if(this.hasSquare(7) && this.hasSquare(8) && this.hasSquare(9)){
            return true;
        }
        else if(this.hasSquare(1) && this.hasSquare(4) && this.hasSquare(7)){
            return true;
        }
        else if(this.hasSquare(2) && this.hasSquare(5) && this.hasSquare(8)){
            return true;
        }
        else if(this.hasSquare(3) && this.hasSquare(6) && this.hasSquare(9)){
            return true;
        }
        else if(this.hasSquare(1) && this.hasSquare(5) && this.hasSquare(9)){
            return true;
        }
        else if(this.hasSquare(3) && this.hasSquare(5) && this.hasSquare(7)){
            return true;
        }
        else{
            return false;
        }
    }

    findWinningMove(opponent_squares) {
        //get all the valid moves
        let validMoves = [];
        if(this._squares.length > 0){
            for(let i=1; i<10; i++){
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
        for(let i=1; i<10; i++){
            if(!this._squares.includes(i) && !opponent_squares.includes(i)){
                validMoves.push(i);
            }
        }

        //When the opponent occupied two corner cell that are diagonally
        //opposite to each other
        console.log(opponent_squares);
        if((opponent_squares.includes(3) && opponent_squares.includes(7)) || (opponent_squares.includes(1) && opponent_squares.includes(9))){
            let moves = validMoves.filter((m) => !(m == 1 || m == 3 || m == 7 || m == 9));
            let r = Math.floor(moves.length*Math.random());
            return moves[r];
        }

        if(!this._squares.includes(9) && opponent_squares.includes(8) && opponent_squares.includes(6)){
            return 9;
        }

        //find the next best move that will give the next winning move
        for(let move of validMoves){
            this._squares.push(move);
            if(this.findWinningMove(opponent_squares) > 0){
                this._squares.pop();
                return move;
            }
            else{
                this._squares.pop();
            }
        }
        
        //if no such a move is found
        //just randomly choose a move
        if(validMoves.includes(5)){
            return 5;
        }
        else if(validMoves.includes(1)){
            return 1;
        }
        else if(validMoves.includes(3)){
            return 3;
        }
        else if(validMoves.includes(7)){
            return 7;
        }
        else if(validMoves.includes(9)){
            return 9;
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
    // ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    // ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(450, 150);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(450, 300);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(150, 0);
    ctx.lineTo(150, 450);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(300, 0);
    ctx.lineTo(300, 450);
    ctx.stroke();
    
    //display a message
    message.innerHTML = "Welcome to Tick Jack's Toe<br>";
    message.innerHTML += p1.name + " can start";
}

//Draw something in response to the click
function draw(e){

    let s = getSquareNo(e.pageX, e.pageY);
    if(count == 0 && modeSingle.checked){
        modeSingle.disabled = true;
        mode2Players.disabled = true;
    }
    
    if(s > 0 && s < 10 && !gameOver && count < 9){
        // console.log(e.pageX + " " + e.pageY);
        // let xy = getSquareCenterXY(e.pageX, e.pageY);
        let xy = getSquareCenterXY(s);
        let x = xy[0];
        let y = xy[1];

        if (!(p1.hasSquare(s) || p2.hasSquare(s))){
            if(count%2 == 0){
                if(p1.addSquare(s)){
                    count += 1;
                    lblCounter.innerHTML = "Counter: " + count;
                    drawCircle(x, y);
                    if(p1.checkWin()){
                        
                        message.innerHTML = p1.name + " has won the game!!!";
                        gameOver = true;
                        showButton();
                        //call the bot to play
                        //implement the mode here
                    }
                    else{
                        message.innerHTML = p2.name + "'s turn";
                        if(count < 9 && modeSingle.checked){
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
                        showButton();
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
    if(count == 9){
        message.innerHTML = "Draw!!";
        gameOver = true;
        showButton();
    }
}

function showButton(){
    let playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Play again!";
    playAgainButton.id = "playAgainButton";
    playAgainButton.className = "playAgainButton";
    playAgainButton.addEventListener("click", resetGame);
    actionBox.appendChild(playAgainButton);
}

function drawCircle(x, y){
    let ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI);
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
    ctx.clearRect(0, 0, 450, 450)
    setCanvas();
    count = 0;
    gameOver = false;
    modeSingle.disabled = false;
    mode2Players.disabled = false;
    p1.clearSquares();
    p2.clearSquares();
    let playAgainButton = document.querySelector("#playAgainButton");
    actionBox.removeChild(playAgainButton);
}

function getSquareNo(x, y){
    if (x < 150 && y < 150){
        return 1;
    }
    else if(x < 300 && x > 150 && y < 150){
        return 2;
    }
    else if(x < 450 && x > 300 && y < 150){
        return 3;
    }
    else if(x < 150 && y > 150 && y < 300){
        return 4;
    }
    else if(x > 150 && x < 300 && y > 150 && y < 300){
        return 5;
    }
    else if(x > 300 && x < 450 && y > 150 && y < 300){
        return 6;
    }
    else if(x > 0 && x < 150 && y > 300 && y < 450){
        return 7;
    }
    else if(x > 150 && x < 300 && y > 300 && y < 450){
        return 8;
    }
    else if(x > 300 && x < 450 && y > 300 && y < 450){
        return 9;
    }
    else{
        return -1;
    }
}

function getSquareCenterXY(s){
    if (s === 1){
        return [75, 75];
    }
    else if(s === 2){
        return [225, 75];
    }
    else if(s === 3){
        return [375, 75];
    }
    else if(s === 4){
        return [75, 225];
    }
    else if(s === 5){
        return [225, 225];
    }
    else if(s === 6){
        return [375, 225];
    }
    else if(s === 7){
        return [75, 375];
    }
    else if(s === 8){
        return [225, 375];
    }
    else if(s === 9){
        return [375, 375];
    }
    else{
        return [0, 0];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function botPlay(){
    c.removeEventListener("click", draw, true);
    let move = p2.findWinningMove(p1.squares);
    // console.log(move);
    if(move > 0){
        //make the winning move
        botMove(move);
    }else{
        //block the opponent
        move = p2.findOpponentWinningMove(p1.squares);
        if(move > 0){
            botMove(move);
        }
        else{
            move = p2.findNextBestMove(p1.squares);
            console.log("Next best move " + move);
            botMove(move);
        }
    }
    if(count == 9){
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
        lblCounter.innerHTML = "Counter: " + count;
        let xy = getSquareCenterXY(m);
        let x = xy[0];
        let y = xy[1];

        drawX(x, y);
        if(p2.checkWin()){
            message.innerHTML = p2.name + " has won the game!!!";
            gameOver = true;
            showButton();
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
