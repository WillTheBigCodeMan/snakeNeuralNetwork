class NN {
    constructor(structure) {
        this.weights = new Array(structure.length - 1);
        this.biasses = new Array(structure.length - 1);
        for (let i = 1; i < structure.length; i++) {
            this.weights[i - 1] = new Array(structure[i]);
            this.biasses[i - 1] = new Array(structure[i]);
            for (let j = 0; j < this.weights[i - 1].length; j++) {
                this.biasses[i - 1][j] = 0;
                this.weights[i - 1][j] = new Array(structure[i - 1]);
                for (let k = 0; k < this.weights[i - 1][j].length; k++) {
                    this.weights[i - 1][j][k] = 0;
                }
            }
        }
        this.ins = structure[0];
        this.struct = structure;
    }
    initialise(weightRange, biasRange) {
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                this.biasses[i][j] = Math.random() * biasRange - (biasRange / 2);
                for (let k = 0; k < this.weights[i][j].length; k++) {
                    this.weights[i][j][k] = Math.random() * weightRange - (weightRange / 2);
                }
            }
        }
    }
    feedForward(inputs) {
        let currentInputs = inputs;
        for (let i = 0; i < this.weights.length; i++) {
            let outputs = matrixDot(currentInputs, this.weights[i]);
            outputs = matrixAdd(outputs, this.biasses[i]);
            currentInputs = outputs;
            for (let j = 0; j < currentInputs.length; j++) {
                currentInputs[j] = activation(currentInputs[j]);
            }
        }
        return currentInputs;
    }
    mutate(weightMutation, biasMutation){
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                this.biasses[i][j] += Math.random() * biasMutation - (biasMutation / 2);
                for (let k = 0; k < this.weights[i][j].length; k++) {
                    this.weights[i][j][k] += Math.random() * weightMutation - (weightMutation / 2);
                }
            }
        }
    }
    crossover(otherNetwork){
        let out = new NN(this.struct);
        let newWeights = new Array(this.weights.length);
        let newBiasses = new Array(this.biasses.length);
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                newWeights[i][j] = new Array(this.weights[i][j].length);
                newBiasses[i][j] = (this.biasses[i][j] + otherNetwork.biasses[i][j]) / 2;
                for (let k = 0; k < this.weights[i][j].length; k++) {
                    newWeights[i][j][k] = (this.weights[i][j][k] + otherNetwork.weights[i][j][k]) / 2;
                }
            }
        }
        out.weights = newWeights;
        out.biasses = newBiasses;
        return out;
    }
}

function matrixDot(m1, m2) {
    if (m1.length == m2[0].length) {
        let product = new Array(m2.length);
        for (let i = 0; i < product.length; i++) {
            if (m1[0].length > 0) {
                product[i] = new Array(m1[0].length);
                for (let k = 0; k < product[i].length; k++) {
                    product[i][k] = 0;
                }
            } else {
                product[i] = 0;
            }
        }
        for (let i = 0; i < product.length; i++) {
            if (product[i].length > 0) {
                for (let j = 0; j < product[i].length; j++) {
                    for (let k = 0; k < m2[i].length; k++) {
                        product[i][j] += m2[i][j] * m1[k][j];
                    }
                }
            } else {
                for (let j = 0; j < m2[i].length; j++) {
                    product[i] += m2[i][j] * m1[j];
                }
            }
        }
        return product;
    } else {
        throw new Error("Incompatible order matrices");
    }
}

function matrixAdd(m1, m2) {
    if (m1.length != m2.length || m1[0].length != m2[0].length) {
        throw new Error("Incompatible order matrices");
    }
    let out = new Array(m1.length);
    for (let i = 0; i < out.length; i++) {
        if (m1[i].length > 0) {
            out[i] = new Array(m1[i].length);
            for (let j = 0; j < out[i].length; j++) {
                out[i][j] = m1[i][j] + m2[i][j];
            }
        } else {
            out[i] = m1[i] + m2[i];
        }
    }
    return out;
}

const activation = (n) => Math.tanh(n);