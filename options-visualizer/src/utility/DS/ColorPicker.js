export default class ColorPicker {
    // Available colors more can be added
    colors = [
        "blue",
        "red",
        "yellow",
        "purple",
        "orange",
        "black",
    ]

    constructor() {
        this.index = 0;
    }

    getColor(){
        const result =  this.colors[this.index];
        // Adjust the index;
        if(this.index >= this.colors.length){
            // We have reached the end reset to zero
            this.index = 0;
        }else{
            // Not at end just add one to index
            this.index++;
        }
        return result;
    }
}