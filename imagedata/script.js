class Network {
    constructor(sizes) {
        this.weights = new Array(sizes.length - 1);
        this.biases = new Array(sizes.length - 1);
        for (let i = 1; i < this.weights.length + 1; i++) {
            this.weights[i - 1] = new Array(sizes[i]);
            this.biases[i - 1] = new Array(sizes[i]);
            for (let j = 0; j < sizes[i]; j++) {
                this.weights[i - 1][j] = new Array(sizes[i - 1]);
                this.biases[i - 1][j] = Math.random() * 2 - 1;
                for (let k = 0; k < this.weights[i - 1][j].length; k++) {
                    this.weights[i - 1][j][k] = Math.random() * 2 - 1;
                }
            }
        }
    }
    feedForward(inputs) {
        let allOutputs = [inputs];
        for (let i = 0; i < this.weights.length; i++) {
            let layerOutputs = new Array(this.weights[i].length);
            for (let j = 0; j < layerOutputs.length; j++) {
                layerOutputs[j] = 0;
            }
            for (let j = 0; j < this.weights[i].length; j++) {
                layerOutputs[j] += this.biases[i][j];
                for (let k = 0; k < this.weights[i][j].length; k++) {
                    layerOutputs[j] += this.weights[i][j][k] * inputs[k];
                }
                layerOutputs[j] = activation(layerOutputs[j]);
            }
            allOutputs.push(layerOutputs);
            inputs = layerOutputs;
        }
        return [inputs, allOutputs];
    }
    train(trainingData, batchSize, cycles, learningRate) {
        console.log(trainingData);
        let index = 0;
        for (let ii = 0; ii < cycles; ii++) {
            let totalWeightVector = new Array(this.weights.length);
            let totalBiasVector = new Array(this.biases.length);
            for (let i = 0; i < this.weights.length; i++) {
                totalWeightVector[i] = new Array(this.weights[i].length);
                totalBiasVector[i] = new Array(this.biases[i].length);
                for (let j = 0; j < this.weights[i].length; j++) {
                    totalWeightVector[i][j] = new Array(this.weights[i][j].length);
                    totalBiasVector[i][j] = 0;
                    for (let k = 0; k < this.weights[i][j].length; k++) {
                        totalWeightVector[i][j][k] = 0;
                    }
                }
            }
            let partialDerivatives;
            for (let jj = 0; jj < batchSize; jj++) {
                index++;
                if (index == trainingData.length) {
                    index = 0;
                }
                let activations = this.feedForward(trainingData[index][0])[1];
                partialDerivatives = new Array(
                    this.weights[this.weights.length - 1].length
                );
                for (let i = 0; i < partialDerivatives.length; i++) {
                    let expected = 0;
                    if (i == trainingData[index][1]) {
                        expected = 1;
                    }
                    partialDerivatives[i] =
                        2 *
                        (expected - activations[activations.length - 1][i]) *
                        sigmoidPrime(
                            inverseSigmoid(activations[activations.length - 1][i])
                        );
                }
                for (let i = this.weights.length - 1; i >= 0; i--) {
                    for (let j = 0; j < this.weights[i].length; j++) {
                        totalBiasVector[i][j] += 1 * partialDerivatives[j];
                        for (let k = 0; k < this.weights[i][j].length; k++) {
                            totalWeightVector[i][j][k] +=
                                activations[i][k] * partialDerivatives[j];
                        }
                    }
                    if (i > 0) {
                        let nextPartialDerivatives = new Array(activations[i].length);
                        for (let j = 0; j < nextPartialDerivatives.length; j++) {
                            nextPartialDerivatives[j] = 0;
                            for (let k = 0; k < this.weights[i].length; k++) {
                                nextPartialDerivatives[j] += (this.weights[i][k][j] * partialDerivatives[k]);
                            }
                            nextPartialDerivatives[j] *= sigmoidPrime(
                                inverseSigmoid(activations[i][j])
                            );
                        }
                        partialDerivatives = nextPartialDerivatives;
                    }
                }
            }
            for (let i = 0; i < this.weights.length; i++) {
                for (let j = 0; j < this.weights[i].length; j++) {
                    this.biases[i][j] +=
                        (totalBiasVector[i][j] / batchSize) * learningRate;
                    for (let k = 0; k < this.weights[i][j].length; k++) {
                        this.weights[i][j][k] +=
                            (totalWeightVector[i][j][k] / batchSize) * learningRate;
                    }
                }
            }
        }
    }
}

function activation(n) {
    return 1 / (1 + Math.pow(Math.E, -1 * n));
}

function sigmoidPrime(n) {
    return activation(n) * (1 - activation(n));
}

function inverseSigmoid(n) {
    return Math.log((n - 1) / (-1 * n));
}

let ai = new Network([784, 16, 16, 10]);

const $ = id => document.getElementById(id);

const fileInput = $("fileInput");
const btnRead = $("btnRead");

let trainingDataGlobal = [];

async function readBinaryFile(file) {
    // Read into an array buffer, create
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer);
    // Show it as hex text
    const lines = [];
    let line = [];
    bytes.forEach((byte, index) => {
        const hex = byte.toString(16).padStart(2, "0");
        line.push(hex);
        if (index % 28 === 27) {
            lines.push(line.join(" "));
            line = [];
        }
    });
    return lines;
    // Get a byte array for that buffer
};

btnRead.addEventListener("click", async () => {
    let files = [];
    let readFiles = new Array(10);
    for (let i = 0; i < 10; i++) {
        files.push($("fileInput" + i.toString()).files[0]);
      //  console.log(files[i])
        readFiles[i] = await readBinaryFile(files[i]);
    }
    console.log(readFiles);
    let trainingData = [];
    for (let i = 0; i < readFiles.length; i++) {
        for (let j = 0; j < readFiles[i].length / 28; j++) {
            trainingData.push([
                [], i
            ]);
            for (let k = 0; k < 28; k++) {
                let splat = readFiles[i][j * 28 + k].split(" ");
               // console.log(splat);
                for (let l = 0; l < splat.length; l++) {
                    trainingData[trainingData.length - 1][0].push((parseInt(splat[l], 16))/255);
                }
            }
        }
    }
   // ai.train(shuffleArray(trainingData),100,100,2);
    trainingDataGlobal = trainingData;
});

function shuffleArray(arr){
    let out = new Array(arr.length);
    let indexes = [];
    for(let i = 0; i < arr.length; i++){
        indexes.push(i);
    }
    for(let i = 0; i < arr.length; i++){
        let x = Math.floor(Math.random() * indexes.length);
        out[i] = arr[indexes[x]];
        indexes.splice(x,1);
    }
    return out;
}

function generateImgs(arr) {
    for (let i = 0; i < arr.length; i++) {
        let newCanvas = document.createElement("canvas");
        newCanvas.width = "56";
        newCanvas.height = "56";
        newCanvas.id = i.toString();
        document.body.appendChild(newCanvas);
        let cCanvas = document.getElementById(i.toString()).getContext("2d");
        for (let j = 0; j < 28; j++) {
            for (let k = 0; k < 28; k++) {
                cCanvas.fillStye = getColor(arr[(i * 28) + j], k);
                cCanvas.strokeStyle = getColor(arr[(i * 28) + j], k);
                cCanvas.fillRect(k * 2, j * 2, 2, 2);
                cCanvas.strokeRect(k * 2, j * 2, 2, 2);
            }
        }
    }
}

function getColor(arr, n) {
    let splat = arr.split(" ");
    let out = "#" + splat[n] + splat[n] + splat[n];
    return out;
}

function displayRandom(){
    const ctx = $("test").getContext("2d");
    let x = Math.floor(Math.random()* trainingDataGlobal.length);
    for (let j = 0; j < 28; j++) {
        for (let k = 0; k < 28; k++) {
            let c = (trainingDataGlobal[x][0][j*28 + k] * 255).toString() ;
            ctx.fillStye = "rgb(" + c + "," + c + "," + c+ ")";
            console.log((trainingDataGlobal[x][0][j*28 + k] * 255).toString());
            ctx.strokeStyle = "rgb(" + c + "," + c + "," + c+ ")";
            ctx.fillRect(k * 2, j * 2, 2, 2);
            ctx.strokeRect(k * 2, j * 2, 2, 2);
        }
    }
    $("outputs").innerHTML = roundArray(ai.feedForward(trainingDataGlobal[x][0])[0]) + "<br>" + maxIndex(ai.feedForward(trainingDataGlobal[x][0])[0]);
}

function roundArray(arr){
    let out = new Array(arr);
    for(let i = 0; i < arr.length; i++){
        out[i] = Math.round(arr[i] * 1000) / 1000;
    }
    return out;
}

function maxIndex(arr){
    let high = arr[0];
    let index = 0;
    for(let i = 1; i < arr.length; i++){
        if(arr[i] > high){
            high = arr[i];
            index = i;
        }
    }
    return index;
}

function trainAi(){
    ai.train(shuffleArray(trainingDataGlobal),100,100,2);
}
