import PerlinNoise from "./perlin-noise.js"

// Ok maintenant ça va génerer un canvas bien comme il faut.
const canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const ctx = canvas.getContext("2d");

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