class population{
    constructor(structure, number, weightsRange, biasRange){
        this.population = new Array(number);
        this.fitnesses = new Array(number);
        for(let i = 0; i < number; i++){
            this.population[i] = new NN(structure);
            this.population[i].initialise(weightsRange, biasRange);
            this.fitnesses[i] = 0;
        }
    }
    advanceGeneration(){
        let sorted = false;
        while(!sorted){
            sorted = true;
            for(let i = 0; i < this.population.length - 1; i++){
                if(this.fitnesses[i] < this.fitnesses[i+1]){
                    const storeF = this.fitnesses[i];
                    const storeN = this.population[i];
                    this.fitnesses[i] = this.fitnesses[i+1];
                    this.population[i] = this.population[i+1];
                    this.population[i+1] = storeN;
                    this.fitnesses[i+1] = storeF;
                    sorted = false;
                }
            }
        }
        
    }
}