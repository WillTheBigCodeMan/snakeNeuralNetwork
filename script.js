class node {
    constructor(_inputs, _biasRange, _weightsRange) {
        this.bias = Math.random() * (_biasRange[1] - _biasRange[0]) + _biasRange[0];
        this.weights = [];
        this.inputs = _inputs;
        for (let i = 0; i < _inputs; i++) {
            this.weights.push(Math.random() * (_weightsRange[1] - _weightsRange[0]) + _weightsRange[0]);
        }
    }
    calcOut(inputs) {
        let total = 0;
        for (let i = 0; i < this.weights.length; i++) {
            total += inputs[i] * this.weights[i];
        }
        total += this.bias;
        return sigmoid(total);
    }
}

class neuralNetwork {
    constructor(_layers, _weightsRange, _biasRange) {
        this.ins = _layers[0];
        this.nodes = [];
        for (let i = 1; i < _layers.length; i++) {
            this.nodes.push([]);
            for (let j = 0; j < _layers[i]; j++) {
                this.nodes[i - 1].push(new node(_layers[i - 1], _biasRange, _weightsRange));
            }
        }
    }
    caclOut(inputs) {
        let currentInputs = inputs;
        for (let i = 0; i < this.nodes.length; i++) {
            let currentOutputs = [];
            for (let j = 0; j < this.nodes[i].length; j++) {
                currentOutputs.push(this.nodes[i][j].calcOut(currentInputs));
            }
            currentInputs = currentOutputs;
        }
        let chosen = 0;
        let high = 0;
        for (let i = 0; i < currentInputs.length; i++) {
            if (currentInputs[i] > high) {
                chosen = i;
                high = currentInputs[i];
            }
        }
        return [chosen, currentInputs];
    }
    train(inputs, expectedOutputs, chunkSize) {
        let index = 0;
        for(let i = 0; i < chunkSize; i ++){
                
        }
    }
}

function cost(outputs, expected){
    let total = 0;
    for(let i = 0; i < outputs.length; i ++){
        if(i == expected){
            total += Math.pow(1-outputs[i], 2);    
        } else {
            total += Math.pow(0-outputs[i], 2);      
        }
    }
    return total;
}

const canvas = document.getElementById("game").getContext("2d");
let nCanvas = document.getElementById("neuralNetwork").getContext("2d");

canvas.fillStyle = "black";
canvas.fillRect(0, 0, 400, 400);

let w = 12;
let h = 12;

let aiPlay = true;

let wS = 400 / w;
let hS = 400 / h;

let snakeAi = new neuralNetwork([8, 16, 16, 4], [-3, 3], [-10, 10]);

dispNeuralNetwork(snakeAi,nCanvas);

let snake = [{
    x: w / 2,
    y: h / 2
}, {
    x: w / 2 - 1,
    y: h / 2
}, {
    x: w / 2 - 2,
    y: h / 2
}, {
    x: w / 2 - 3,
    y: h / 2
}];

let apple = {
    x: w / 2 + 2,
    y: h / 2
};

let dir = [0, 0];
let nextDir = [0, 0];

function dispSnake() {
    for (let i = 0; i < snake.length; i++) {
        canvas.fillStyle = "lightGreen";
        canvas.fillRect(snake[i].x * wS, snake[i].y * hS, wS, hS);
        canvas.strokeStyle = "darkGreen";
        canvas.strokeRect(snake[i].x * wS, snake[i].y * hS, wS, hS);
    }
}

function dispApple() {
    canvas.fillStyle = "red";
    canvas.fillRect(apple.x * wS, apple.y * hS, wS, hS);
    canvas.strokeStyle = "crimson";
    canvas.strokeRect(apple.x * wS, apple.y * hS, wS, hS);
}

function moveSnake() {
    if (((dir[0] == 0 && nextDir[1] == 0) || (dir[1] == 0 && nextDir[0] == 0)) && !(dir[0] == 0 && dir[1] == 0 && nextDir[0] == -1 && nextDir[1] == 0)) {
        dir = nextDir;
    }
    if (!(dir[0] == 0 && dir[1] == 0)) {
        for (let i = snake.length - 1; i > 0; i--) {
            snake[i].x = snake[i - 1].x;
            snake[i].y = snake[i - 1].y;
        }
        snake[0].x += dir[0];
        snake[0].y += dir[1];
    }
}

function checkApple() {
    if (snake[0].x == apple.x && snake[0].y == apple.y) {
        snake.push({
            x: -1,
            y: -1
        });
        while (true) {
            apple = {
                x: Math.floor(Math.random() * w),
                y: Math.floor(Math.random() * h)
            };
            let val = true;
            for (let i = 0; i < snake.length; i++) {
                if (apple.x == snake[i].x && apple.y == snake[i].y) {
                    val = false;
                    break;
                }
            }
            if (val) {
                break;
            }
        }
    }
}

function checkSnake() {
    if (snake[0].x < 0 || snake[0].x > w || snake[0].y < 0 || snake[0].y > h) {
        reset();
    }
    for (let i = 2; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            reset();
        }
    }
}

function reset() {
    snake = [{
        x: w / 2,
        y: h / 2
    }, {
        x: w / 2 - 1,
        y: h / 2
    }, {
        x: w / 2 - 2,
        y: h / 2
    }, {
        x: w / 2 - 3,
        y: h / 2
    }];
    apple = {
        x: w / 2 + 2,
        y: h / 2
    };
    dir = [0, 0];
    nextDir = [0, 0];
}

function update() {
    canvas.fillStyle = "rgba(0,0,0,1)";
    canvas.fillRect(0, 0, 400, 400);
    if (aiPlay) {
        let xPObs = 0;
        let xNObs = 0;
        let yPObs = 0;
        let yNObs = 0;
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x == snake[0].x + 1) {
                xPObs = 1;
            }
            if (snake[i].x == snake[0].x - 1) {
                xNObs = 1;
            }
            if (snake[i].y == snake[0].y + 1) {
                yPObs = 1;
            }
            if (snake[i].y == snake[0].y - 1) {
                yNObs = 1;
            }
        }
        let aiDescision = snakeAi.caclOut([snake[0].x - apple.x, snake[0].y - apple.y, dir[0], dir[1], xPObs, xNObs, yPObs, yNObs, ]);
        switch (aiDescision[0]) {
            case 0:
                nextDir = [-1, 0];
                break;
            case 1:
                nextDir = [0, -1];
                break;
            case 2:
                nextDir = [1, 0];
                break;
            case 3:
                nextDir = [0, 1];
                break;
        }
    }
    moveSnake();
    checkApple();
    checkSnake();
    dispApple();
    dispSnake();
}

function sigmoid(n) {
    return 1 / (1 + Math.pow(Math.E, -1 * n));
}

setInterval(update, 250);

document.addEventListener('keydown', e => {
    console.log(snakeAi);
    switch (e.keyCode) {
        case 37:
            nextDir = [-1, 0];
            break;
        case 38:
            nextDir = [0, -1];
            break;
        case 39:
            nextDir = [1, 0];
            break;
        case 40:
            nextDir = [0, 1];
            break;
    }
});

function dispNeuralNetwork(NN,canv){
    canv.fillStyle = "#EEEEEE";
    canv.fillRect(0,0,600,250);
    for(let i = 0; i < NN.ins; i ++){
        canv.strokeStyle = "black"
        canv.strokeRect(600 / (NN.nodes.length + 2), 250 / (NN.ins + 2) * (i + 1), 10, 10);
    }
    for(let i = 0; i < NN.nodes.length; i++){
        for(let j = 0; j < NN.nodes[i].length; j++){
            canv.strokeStyle = "black"
            if(NN.nodes[i][j].bias > 0){
                canv.fillStyle = "rgba(0,0,255," + (NN.nodes[i][j].bias/10).toString() + ")";
            } else {
                canv.fillStyle = "rgba(255,0,0," + (-1*NN.nodes[i][j].bias/10).toString() + ")";
            }
            canv.fillRect(600 / (NN.nodes.length + 2) * (i + 2), 250 / (NN.nodes[i].length + 2) * (j + 1), 10, 10);
            canv.strokeRect(600 / (NN.nodes.length + 2) * (i + 2), 250 / (NN.nodes[i].length + 2) * (j + 1), 10, 10);
            for(let k = 0; k < NN.nodes[i][j].weights.length; k ++){
                if(NN.nodes[i][j].weights[k] > 0){
                    canv.strokeStyle = "rgba(0,0,255," + (NN.nodes[i][j].weights[k]/6).toString() + ")";
                } else {
                    console.log("rargh");
                    canv.strokeStyle = "rgba(255,0,0," + (-1*NN.nodes[i][j].weights[k]/6).toString() + ")";
                }
                canv.moveTo(600 / (NN.nodes.length + 2) * (i + 2), 250 / (NN.nodes[i].length + 2) * (j + 1) + 5);
                let lLength = 0;
                if(i - 1 < 0){
                    lLength = NN.ins;
                } else {
                    lLength = NN.nodes[i - 1].length;
                }
                canv.lineTo(600 / (NN.nodes.length + 2) * (i + 1) + 10, 250 / (lLength + 2) * (k + 1) + 5);
                canv.stroke();
            }
        }
    }
}
