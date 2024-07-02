class Random{
    constructor(seed){
        this.seed = seed | Math.random()*10000;
        this.nextGen = this.seed;
        // console.log(seed);
    }

    //J'utilise la méthode de Von Neumann
    random(){
        var square = Math.pow(this.nextGen,2);
        this.nextGen = this.middleDigit(square);
        return this.nextGen/10000;
    }
    
    middleDigit(n){
        var s = n.toString();
        if (s.length<4) {
            return n;
        }
        else{
            var start = (s.length/2)+2;
            var end = start+4;
            var resS = s.substring(start, end);
            return resS
        }
    }

}

export default Random;