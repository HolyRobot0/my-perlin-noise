import Vector from "./vector.js";
import Random from "./random.js";

class PerlinNoise{

    constructor(depth,freq,ampl,seed){
        this.depth = depth | 4;
        this.freq = freq | 4;
        this.ampl = ampl || 0.5;
        this.seed = seed || Math.random(); //new Random(seed) dans le futur
        this.grids = [this.depth];
    }

    /**
     * @returns Un nombre aléatoire en fonction de la seed. ça devra renvoyé un nombre entre 0 et 1
     */
    random(){
        //Pour le moment, n'ayant pas implémenter les fonctions pour le pseudo-aléatoire, je vais simplement utiliser du random pure et simple.
        return Math.random()
    }

    /**
     * @returns un vecteur normé aléatoire (basé sur la seed)
     */
    randomVector(){
        var angle = this.random()*Math.PI*2;
        var vector = new Vector(Math.cos(angle),Math.sin(angle));
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
     * @param {float} x 
     * @param {float} y 
     * @param {Vector[][]} vectorGrid 
     * @returns l'intensité du point de 0 à 1 aux coordonnées x,y par rapport à la grille donnée.
     */
    getPerlinInGrid(x,y,vectorGrid){
        if(x==0 || x==1 || y==0 || y==1) return 0; //Comme ça je m'assure de ne jamais toucher aux bords
        var currentFreq = vectorGrid.length-1;

        //On obtient les coordonnées relatives du point dans sa cellule. Le tout de 0 à 1
        var xInCell = x%(1/currentFreq)*currentFreq; 
        var yInCell = y%(1/currentFreq)*currentFreq;

        var tlCornerX = (x-xInCell/currentFreq)*currentFreq;
        var tlCornerY = (y-yInCell/currentFreq)*currentFreq;

        var tlVect = vectorGrid[tlCornerX][tlCornerY];
        var trVect = vectorGrid[tlCornerX+1][tlCornerY];
        var blVect = vectorGrid[tlCornerX][tlCornerY+1];
        var brVect = vectorGrid[tlCornerX+1][tlCornerY+1];

        //Là je calcule les vecteurs par rapport aux coins.
        var pVectTL = new Vector((xInCell),(yInCell));
        var pVectTR = new Vector((xInCell-1),(yInCell));
        var pVectBL = new Vector((xInCell),(yInCell-1));
        var pVectBR = new Vector((xInCell-1),(yInCell-1));

        //Puis les produit sclaire de chaque vecteurs par rapport à leur coin respectif.
        var scalTL = pVectTL.scalaireProd(tlVect);
        var scalTR = pVectTR.scalaireProd(trVect);
        var scalBL = pVectBL.scalaireProd(blVect);
        var scalBR = pVectBR.scalaireProd(brVect);

        //Ici je modifie mes coordonnée à l'interieur de la cellule pour les adoucir 
        var smoothCoord = (coo) => coo < 0.5 ? 4 * coo * coo * coo : 1 - Math.pow(-2 * coo + 2, 3) / 2;
        var newXInCell = smoothCoord(xInCell);
        var newYInCell = smoothCoord(yInCell);

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

export default PerlinNoise;
