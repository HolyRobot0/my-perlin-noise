class Vector{
    /**
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
     * @param {Vector} v2 
     * @returns le produit scalaire de 2 vecteurs.
     */
    scalaireProd(v2){
        return this.x*v2.x + this.y*v2.y;
    }

    /**
     * @param angle un float décrivant un angle radiant.
     * Tourne le vecteur
     */
    rotateVector(angle){
        var x = this.x; var y = this.y;
        this.x = x*Math.cos(angle)-y*Math.sin(angle);
        this.y = x*Math.sin(angle)+y*Math.cos(angle);
    }
}

export default Vector;