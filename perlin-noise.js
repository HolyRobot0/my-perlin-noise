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

class VectorPoint{ //C'est un VectorPoint car ils sont très très similaire dans leur utilisation.
    /**
     * 
     * @param {float} x 
     * @param {float} y 
     */
    constructor(x,y){
        this.x=x;
        this.y=y;
    }

    /**
     * @returns la longueure du vecteur
     */ //Je sais pas si ça sera utilise mais si jamais, c'est là hahahaha
    getNorme(){
        return Math.sqrt((this.x*this.x)+(this.y*this.y))
    }

    /**
     * norme le vecteur à une longueure de 1.
     */
    beNormed(){
        var norme = this.getNorme;
        this.x = this.x/norme;
        this.y = this.y/norme;
    }

    /**
     * 
     * @param {VectorPoint} v2 
     * @returns le produit scalaire de 2 vecteurs.
     */
    scalaireProd(v2){
        return this.x*v2.x + this.y*v2.y;
    }

    /**
     * 
     */
    rotateVector(angle){
        var x = this.x; var y = this.y;
        this.x = x*Math.cos(angle)-y*Math.sin(angle);
        this.y = x*Math.sin(angle)+y*Math.cos(angle);
    }
}

class PerlinNoise{

    //Plus tard, il faudra faire en sorte de pouvoir spécifier 1 à 1 chaque paramètre ou non. En passant par un objet par exemple.
    constructor(depth,freq,ampl,seed){
        this.depth = depth | 4; //La depth(profondeur) représente le détaille à apporter au bruit. C'est le nombre de fraction en plus apporter au bruit.
        this.freq = freq | 4; //La fréquence (Qui par défaut est à 4) représente la précision du bruit. Plus elle est élevée, plus le bruit est fin.
        this.ampl = ampl || 0.5; //L'amplitude représente la hauteur max du bruit courant. 
        this.seed = seed || Math.random(); // | generateSeed(). La seed est utlisée pour calculé l'aléatoire des vecteurs.
        this.currentSeed = seed;
        this.grids = [this.depth]; //grids contient les différente grille aux différente fréquences.
    }

    /**
     * @returns Un nombre aléatoire en fonction de la seed. ça devra renvoyé un nombre entre 0 et 1
     */
    random(){
        //Pour le moment, n'ayant pas implémenter les fonctions pour le pseudo-aléatoire, je vais simplement utiliser du random pure et simple.
        return Math.random()
    }

    /**
     * Génère un vecteur aléatoire (basé sur la seed)
     */
    randomVector(){
        var angle = this.random()*Math.PI*2;
        var vector = new VectorPoint(Math.cos(angle),Math.sin(angle));
        return vector;
    }

    generateGrid(freq){
        var vectorGrid = [freq+1];
        for(let i=0; i<=freq ; i++){
            var vectorCol = [freq+1];
            for(let j=0; j<=freq; j++){
                vectorCol[j]= this.randomVector();
            }
            vectorGrid[i]=vectorCol;
        }
        return vectorGrid;    
    }

    /**
     * Place dans grid les bruits de perlin de chaque profondeur.
     */
    generateNoise(){
        for(let d=0; d<this.depth ; d++){
            this.grids[d]=this.generateGrid(this.freq*(Math.pow(2,d)));
        }
    }

    /**
     * 
     * @param {float} x 
     * @param {float} y 
     * @param {VectorPoint[][]} vectorGrid 
     * @returns l'intensité du point de 0 à 1 aux coordonnées x,y par rapport à la grille donnée.
     */
    getPerlinInGrid(x,y,vectorGrid){
        if(x==0 || x==1 || y==0 || y==1) return 0; //Comme ça je m'assure de ne jamais toucher aux bords
        var currentFreq = vectorGrid.length-1; //Ici on fais la longueure -1 car on veut réobtenir la fréquence de base

        //On obtient les coordonnées relatives du point dans sa cellule. Le tout de 0 à 1
        var xInCell = x%(1/currentFreq)*currentFreq; 
        var yInCell = y%(1/currentFreq)*currentFreq;

        var tlCornerX = (x-xInCell/currentFreq)*currentFreq;
        var tlCornerY = (y-yInCell/currentFreq)*currentFreq;

        var tlVect = vectorGrid[tlCornerX][tlCornerY];
        var trVect = vectorGrid[tlCornerX+1][tlCornerY];
        var blVect = vectorGrid[tlCornerX][tlCornerY+1];
        var brVect = vectorGrid[tlCornerX+1][tlCornerY+1];

        //Là je calcule les vecteur par rapport aux coins.
        var pVectTL = new VectorPoint((xInCell),(yInCell));
        var pVectTR = new VectorPoint((xInCell-1),(yInCell));
        var pVectBL = new VectorPoint((xInCell),(yInCell-1));
        var pVectBR = new VectorPoint((xInCell-1),(yInCell-1));

        //Puis les produit sclaire de chaque vecteurs par rapport à leur coin respectif.
        var scalTL = pVectTL.scalaireProd(tlVect);
        var scalTR = pVectTR.scalaireProd(trVect);
        var scalBL = pVectBL.scalaireProd(blVect);
        var scalBR = pVectBR.scalaireProd(brVect);

        //Ici je modifie mes coordonnée à l'interieur de la cellule pour les adoucir 
        var smoothCoord = (coo) => coo < 0.5 ? 4 * coo * coo * coo : 1 - Math.pow(-2 * coo + 2, 3) / 2;
        var newXInCell = smoothCoord(xInCell);
        var newYInCell = smoothCoord(yInCell);

        //Sinon ici, l'étape c'est de faire des interpollation BIlinéaire pour bien obtenir un résultat entre 0 et 1 
        //Ici, je peut donc faire une moyenne entre le coin TL et TR, puis entre les coins BL et BR, puis une moyenne entre le haut et le bas. 

        //J'lai faite de mémoire et par logique, mais à corrigé si ça ne fonctionne pas.
        var BiInterpol = (valeur,a,b) => a + valeur*(b-a);

        var moyTop = BiInterpol(newXInCell,scalTL,scalTR);
        var moyBottom = BiInterpol(newXInCell,scalBL,scalBR);
        var moyAll = BiInterpol(newYInCell,moyTop,moyBottom); //En fait ce résultat là il peut être négatif, et c'est pas sa faute.

        //J'adapte le résultat pour qu'il soit compris entre 0 et 1. Mais normalement il est entre -1 et 1;
        var intensity = (moyAll+1)/2;
        return intensity;
    }

    /**
     * @param {float} x compris entre 0 et 1
     * @param {float} y compris entre 0 et 1
     * @returns {float} l'intensité du point d'après le
     */
    getPerlin(x,y){
        //Dans un premier temps, il faut obtenir l'intensité de la première grille, à laquelle on ajoutera l'intensité de la 2eme puis 3eme etc...
        var intensity = 0.0;
        for(let d=0; d<this.depth ; d++){
            intensity+= this.getPerlinInGrid(x,y,this.grids[d])*(this.ampl/Math.pow(2,d));
        }
        return intensity;
    }

    /**
     * @param {float} angle 
     */
    rotatePerlin(angle){
        for(let d=0; d<this.grids.length ; d++){
            for(let i=0; i<this.grids[d].length ; i++){
                for(let j=0 ; j<this.grids[d][i].length; j++){
                    this.grids[d][i][j].rotateVector(angle);
                }
            }
        }
    }

    /**
     * @returns Les paramètre du bruit sous forme de string.
     */
    toString(){
        var s = 
        `Seed : ${this.seed}.\nDepth : ${this.depth} | Frequence : ${this.freq} | Amplitude : ${this.ampl}`;
        return s;
    }
}




// Ok maintenant ça va génerer un canvas bien comme il faut.
const canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const ctx = canvas.getContext("2d");

var grad = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
grad.addColorStop(0, "lightblue");
grad.addColorStop(1, "darkblue"); 

ctx.fillStyle = grad;
ctx.fillRect(0,0,canvas.width,canvas.height);


function drawPerlin(noise){
    for(let x=0; x<canvas.width ; x++){
        for(let y=0; y<canvas.height ; y++){
            let greaterSide = (canvas.width>canvas.height) ? canvas.width : canvas.height; 
            var intensity = noise.getPerlin((x+1)/(greaterSide+2),(y+1)/(greaterSide+2)); //Je mets une marge comme ça on est parfait.
            var high = Math.floor(intensity*256);
            var line = (high%4==0)? 70 : high
            ctx.fillStyle = `rgba(0,${line/2},${line},255)`
            ctx.fillRect(x,y,1,1);
        }
    }
}


function applyPerlin(interval){
    const perlin = new PerlinNoise();
    perlin.generateNoise();
    drawPerlin(perlin);
    if(interval>1){
        setInterval(()=>{
            perlin.rotatePerlin(0.1);
            drawPerlin(perlin);
        },interval);
    }
    
    
    
}

applyPerlin(-1);


