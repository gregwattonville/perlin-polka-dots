// Ratios
// 1.5, 24x36 Resolution of 5400x3600
// 1.5, 32x48 Resolution of 3200x4800
// 1, 48x48 Resolution of 4800x4800

// HTML inputs id's
let _htmlInputs = {};
_htmlInputs.drawButton = 'js-btn-draw';

// Default Values for P5
let p5Defaults = {};
p5Defaults.background = '#fff';


let perlinCircle = {};
perlinCircle.segments = 50;
perlinCircle.numberOfAngles = 2*Math.PI/perlinCircle.segments;
perlinCircle.noiseScale = 0.5;
perlinCircle.timeScale = 0.01;
perlinCircle.timeDiff = 1000;


perlinCircle.render = (x, y, minSize, maxSize, fillColor) => {
    timeUnique = Math.random(perlinCircle.timeDiff);

    noiseDetail(8, 0.5);
    translate(x, y);
    fill(fillColor);

    beginShape();

        for (let s = 0; s < perlinCircle.segments+1; s++) {
            const deltaVertex = perlinCircle.findNextCoords(s, minSize, maxSize, timeUnique);    
            vertex(deltaVertex.dx, deltaVertex.dy);
        }


    endShape(CLOSE);
} 

perlinCircle.findNextCoords = (currentSegment, minRad, maxRad, time) => {
    const angle = perlinCircle.numberOfAngles * currentSegment;
    const cosAngle = cos(angle);
    const sinAngle = sin(angle);

    const noiseX = perlinCircle.noiseScale * cosAngle + perlinCircle.noiseScale;
    const noiseY = perlinCircle.noiseScale * sinAngle + perlinCircle.noiseScale;
    
    const noiseValue = noise(noiseX, noiseY, time);

    const rad = maxRad * noiseValue + minRad;

    const dx = rad * cosAngle;
    const dy = rad * sinAngle;

    return {dx: dx, dy: dy};
}


let _circleColor = document.getElementById("js-input-color").value

function setup() {
    const canvas = createCanvas(1920, 1080);
    canvas.parent('sketch');
    //noLoop();
  }
  
  function draw() {
    /*
    if (mouseIsPressed) {
      fill(0);
    } else {
      fill(255);
    }
    ellipse(mouseX, mouseY, 80, 80);
    */

    //perlinCircle.render(mouseX, mouseY, 10, 10, '#e6194b');

  }


  function mouseClicked() {
    _circleColor = document.getElementById("js-input-color").value
    perlinCircle.render(mouseX, mouseY, 10, 10, _circleColor);
  }
  
  
  document.getElementById(_htmlInputs.drawButton).addEventListener("click", function(){
      console.log('Draw');
      redraw();
  });