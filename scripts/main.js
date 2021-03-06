let canvas = document.getElementById("myCanvas")
let ctx = canvas.getContext("2d")
//hi
let x = canvas.width/2;
let y = canvas.height-30;

let dx = 2;
let dy = -2;

let ballRadius = 15;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10
let brickOffsetTop =30
let brickOffsetLeft = 30

let score = 0;

// set up a 2-dimensional array for the bricks
let bricks = [];
for (let c=0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, show: true };
    }
}

function drawBall() {
   ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#ee82ee";
    ctx.fill();
    ctx.closePath(); 

}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0000ff";
    ctx.fill();
    ctx.closePath();

}

function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if (bricks[c][r].show == true) {
                let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#3cb371";
                ctx.fill();
                ctx.closePath();  
            }
        }
    }
}

function draw() {
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the bricks 
    drawBricks();
    
    // drawing the ball 
    drawBall();

    // chnage the x and y values for the ball
    x += dx;
    y += dy;
    //check to see if we've gone off the edge of the board 
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) { // ceiling check 
        dy = -dy;
    } else if (y + dy > canvas.height-ballRadius) { // floor check 
        if (x > paddleX && x < paddleX + paddleWidth) { //paddle check 
            dy = -dy;
        } else { // it hit the floor
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval); // Needed for browser to end game 
        }
    }

    //paddle controls
    if(rightPressed) {
        paddleX += 10;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed) {
        paddleX -= 10;
        if (paddleX < 0){
            paddleX = 0;
        }
    }

    drawPaddle();

    //check whether the ball is touching any bricks
    collisionDetection();

    drawScore();

    drawLives();

}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.show == true) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.show = false;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                        clearInterval(interval); // Needed for browser to end game 
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#d1de00";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#d13800";
    ctx.fillText("lives: 1", 20, 40);   
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

document.addEventListener("mousemove", mouseMoveHandler, false);

let interval = setInterval(draw, 15);
