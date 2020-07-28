// Ratios
// 1.5, 24x36 Resolution of 5400x3600
// 1.5, 32x48 Resolution of 3200x4800
// 1, 48x48 Resolution of 4800x4800

//const _p5 = new p5();
const _svg = document.querySelector('svg')
const _pt = _svg.createSVGPoint();  // Created once for document
let _svgDotsHtml = '';
let _svgDotsHtmlList = [];
let _svgDotsHtmlListUndo = [];
let _svgAspectRatio = '1.6';

const _perlinDot = new PerlinDotSVG();


let _circleColor = document.getElementById("js-input-color").value


const setupSvgCanvas = (aspectRatio) => {
    let svgWidthPercent = _svgAspectRatio;
    const divSketchWidth = document.getElementById("sketch-wrapper").offsetWidth;
    const intViewportHeight = window.innerHeight;
    
    if (aspectRatio === '1') {
        _svgAspectRatio = aspectRatio;
        svgWidthPercent = configSvgDimensions(divSketchWidth, intViewportHeight, 1)
        _svg.setAttribute("viewBox", "0 0 1280 1280"); 
    } else if (aspectRatio === '1.25') {
        _svgAspectRatio = aspectRatio;
        svgWidthPercent = configSvgDimensions(divSketchWidth, intViewportHeight, 1.25)
        _svg.setAttribute("viewBox", "0 0 1280 1024"); 
    } else if (aspectRatio === '1.6') {
        _svgAspectRatio = aspectRatio;
        svgWidthPercent = configSvgDimensions(divSketchWidth, intViewportHeight, 1.6)
        _svg.setAttribute("viewBox", "0 0 1280 800"); 
    } else {
        return false;
    }

    _svg.setAttribute("width", `${svgWidthPercent}%`);
}

const configSvgDimensions = (width, height, aspectRatio) => {
    
    // height > width, return 100%
    if (height >= width) {
        return 100;
    } else {
        const widthWeNeed = height * _svgAspectRatio;
        if (widthWeNeed >= width ) {
            return 100;
        } else {
            // Find percent width needed to fit within the height and take a little off for a better fit
            return Math.floor( widthWeNeed/width*100 )-1;   
        }
    }
}




// HTML inputs id's
let _htmlInputs = {};
_htmlInputs.drawButton = 'js-btn-draw';


function drawSvg(svgHtml) {
    _svg.innerHTML = svgHtml;
}


function addPerlinCircle(e) {
    _perlinDot.fillColor = document.getElementById("js-input-color").value;
    //console.log('Color: ',document.getElementById("js-input-color").value);
    _perlinDot.segments = parseInt(document.getElementById("js-input-segments").value);
    //console.log('Segments: ', parseInt(document.getElementById("js-input-segments").value));
    _perlinDot.minSize = parseInt(document.getElementById("js-input-minSize").value);
    //console.log('minSize: ',document.getElementById("js-input-minSize").value);
    _perlinDot.maxSize = parseInt(document.getElementById("js-input-maxSize").value);
    //console.log('maxSize: ',document.getElementById("js-input-maxSize").value);
    _perlinDot.direction = parseInt(document.getElementById("js-select-direction").value);


    _pt.x = e.clientX;
    _pt.y = e.clientY;

    // The cursor point, translated into svg coordinates
    const cursorpt =  _pt.matrixTransform(_svg.getScreenCTM().inverse());
    //console.log(`(${cursorpt.x}, ${cursorpt.y})`);

    const circleHtml = _perlinDot.render(cursorpt.x, cursorpt.y, _perlinDot.direction);

    _svgDotsHtmlList.push(circleHtml);
    _svgDotsHtml += circleHtml;

    drawSvg(_svgDotsHtml);
}


document.getElementById("js-svg").onclick = addPerlinCircle;
document.getElementById("js-btn-undo").onclick = (e) => { undoDraw(_svgDotsHtmlList, _svgDotsHtmlListUndo, drawSvg); };
document.getElementById("js-btn-redo").onclick = (e) => { redoDraw(_svgDotsHtmlList, _svgDotsHtmlListUndo, drawSvg); };
document.getElementById("js-btn-save").onclick = (e) => { saveSVG(_svg); };
document.getElementById("js-select-aspectRatio").onchange = (e) => { setupSvgCanvas(e.target.value); };

setupSvgCanvas(_svgAspectRatio);