const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const blockWidth = 100
const blockHeight = 20
const boardWidth = 600
const boardHeight = 300
const ballDiameter = 20
let xDirection = 2
let yDirection = 2
let timerId
let score = 0

const userStart = [250, 10]
let currentPosition = userStart

const ballStart = [290, 35]
let ballCurrentPosition = ballStart

//create Block
class Block {
    constructor(xAxis, yAxis){
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [ xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

//all my blocks
const blocks = []
for(let j = 0; j < 1; j++){
    for(let i = 0; i < 5; i++){
        let block = new Block(50 + (110 * i) - (j%2) * 45, 270 - (j * 30))
        blocks.push(block)
    }
}


//console.log(blocks[0])

//draw my block
function addBlocks() {

    for(let i = 0; i < blocks.length; i++){
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomLeft[1] + 'px'
        grid.appendChild(block)
    }
}

addBlocks()

//add user
const user = document.createElement('div')
user.classList.add('user')
grid.appendChild(user)

//draw user
function drawUser(){
    user.style.left = currentPosition[0] + 'px'
    user.style.bottom = currentPosition[1] + 'px'
}
drawUser()

//move user
function moveUser(e){
    switch(e.key){
        case 'ArrowLeft':
            if(currentPosition[0] > 0){
                currentPosition[0] -= 10
                drawUser()
            }
            break;
        case 'ArrowRight':
            if(currentPosition[0] < boardWidth - blockWidth){
                currentPosition[0] += 10
                drawUser()
            }
            break;
    }
}

document.addEventListener('keydown', moveUser)

//add ball
const ball = document.createElement('div')
ball.classList.add('ball')

grid.appendChild(ball)

//draw ball
function drawBall(){
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
    ball.style.width = ballDiameter + 'px'
    ball.style.height = ballDiameter + 'px'
}
drawBall()

//move ball
function moveBall(){
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollisions()
}

timerId = setInterval(moveBall, 30)

//check collisions
function checkForCollisions(){
    //check for wall collisions
    if(ballCurrentPosition[0] >= (boardWidth - ballDiameter) || ballCurrentPosition[0] <= 0){
        changeDirectionX()
    }
    if(ballCurrentPosition[1] >= (boardHeight - ballDiameter) || ballCurrentPosition[1] <= 0){
        changeDirectionY()
    }

    //check out of bottom border -> Lose
/*     if(ballCurrentPosition[1] <= 0){
        clearInterval(timerId)
        scoreDisplay.innerHTML = 'You Lose'
        document.removeEventListener('keydown', moveUser)
    } */

    //check for block collisions
    for(let i = 0; i < blocks.length; i++){
        if(
            (ballCurrentPosition[0] + ballDiameter > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
            (ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].bottomRight[1])
        ){
            console.log("Hit a block")
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i, 1)
            changeDirectionY()
            score ++
            scoreDisplay.innerHTML = score
        }
        if(
            (ballCurrentPosition[0] + ballDiameter > blocks[i].topLeft[0] && ballCurrentPosition[0] < blocks[i].topRight[0]) &&
            (ballCurrentPosition[1] + ballDiameter > blocks[i].topLeft[1] && ballCurrentPosition[1] < blocks[i].topRight[1])
        ){
            console.log("Hit a block")
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i, 1)
            changeDirectionX()
            score ++
            scoreDisplay.innerHTML = score
        }
        if(blocks.length === 0){
            scoreDisplay.innerHTML = 'YOU WIN'
            clearInterval(timerId)
            document.removeEventListener('keydown', moveUser)
        }
    }

    //check for user collision
    if((ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
    (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)
    ){
        changeDirectionY()
    }
}

function changeDirectionX(){
    xDirection *= -1
}

function changeDirectionY(){
    yDirection *= -1
}

