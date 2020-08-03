// Ratios
// 1.5, 24x36 Resolution of 5400x3600
// 1.5, 32x48 Resolution of 3200x4800
// 1, 48x48 Resolution of 4800x4800

//const _p5 = new p5();
const _svg = document.getElementById('js-svg');
const _topHeader = document.getElementById('js-div-topHeader');
const _spanSelectedColorRange = document.getElementById('js-span-selectedColorsRange');
const _colorsDiv = document.getElementById('js-div-colors');
const _menuBreakpoint = 1200;
const _pt = _svg.createSVGPoint();  // Created once for document
let _svgDotsHtml = '';
let _svgDotsHtmlList = [];
let _svgDotsHtmlListUndo = [];
let _svgAspectRatio = '1.6';
let colorCodes = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#000000', '#F5F5F5'];

const _perlinDot = new PerlinDotSVG();


let _circleColor = document.getElementById("js-input-color").value


const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};


const setupSvgCanvas = (breakpoint, aspectRatio) => {
    let svgWidthPercent = _svgAspectRatio;
    const divSketchWidth = document.getElementById("sketch-wrapper").offsetWidth;
    const intViewportHeight = window.innerHeight;
    
    if (aspectRatio === '1') {
        _svgAspectRatio = aspectRatio;
        svgWidthPercent = configSvgDimensions(divSketchWidth, intViewportHeight, breakpoint, 1)
        _svg.setAttribute("viewBox", "0 0 1280 1280"); 
    } else if (aspectRatio === '1.25') {
        _svgAspectRatio = aspectRatio;
        svgWidthPercent = configSvgDimensions(divSketchWidth, intViewportHeight, breakpoint, 1.25)
        _svg.setAttribute("viewBox", "0 0 1280 1024"); 
    } else if (aspectRatio === '1.6') {
        _svgAspectRatio = aspectRatio;
        svgWidthPercent = configSvgDimensions(divSketchWidth, intViewportHeight, breakpoint, 1.6)
        _svg.setAttribute("viewBox", "0 0 1280 800"); 
    } else {
        return false;
    }

    _svg.setAttribute("width", `${svgWidthPercent}%`);
}

const configSvgDimensions = (width, height, breakpoint, aspectRatio) => {
    let currentHeight = height;
    if(currentHeight < breakpoint) {
        currentHeight = currentHeight - _topHeader.offsetHeight-5;
    } 
    // height > width, return 100%
    if (currentHeight >= width) {
        return 100;
    } else {
        const widthWeNeed = currentHeight * aspectRatio;
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
_htmlInputs.rangeNumberOfColors = document.getElementById("js-range-numberOfColors");


function drawSvg(svgHtml, updateGlobalHtml = false) {
    if(updateGlobalHtml) {
        _svgDotsHtml = svgHtml
    }
    _svg.innerHTML = svgHtml;
}


const addPerlinCircle = (e) => {
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

const updateColors = (rangeVal) => {
    _spanSelectedColorRange.innerHTML = rangeVal;
    const aColor = '#e6194b';
    let colorsHtml = '';
    for (let i = 0; i < rangeVal; i++) {
        //const element = array[i];
        const colorSelectHtml = `<div class="row g-3 align-items-center mb-3">
                        <div class="col-auto">
                            <label for="inputColorInput" class="form-label">Color ${i+1}</label>
                        </div>
                        <div class="col-auto" style="min-width: 64px;">
                            <input type="color" class="form-control form-control-color" id="js-input-color-${i}" value="${colorCodes[i]}" title="Choose your color">
                        </div>
                    </div>`;
        colorsHtml += colorSelectHtml;
    }
    _colorsDiv.innerHTML = colorsHtml;
    
};


const createDots = () => {

    const svgWidth = _svg.clientWidth;

    const svgHeight = _svg.clientHeight;

    _perlinDot.segments = parseInt(document.getElementById("js-input-segments").value);
    //console.log('Segments: ', parseInt(document.getElementById("js-input-segments").value));
    _perlinDot.minSize = parseInt(document.getElementById("js-input-minSize").value);
    //console.log('minSize: ',document.getElementById("js-input-minSize").value);
    _perlinDot.maxSize = parseInt(document.getElementById("js-input-maxSize").value);
    //console.log('maxSize: ',document.getElementById("js-input-maxSize").value);
    _perlinDot.direction = parseInt(document.getElementById("js-select-direction").value);

    const numberOfRows = parseInt(document.getElementById("js-input-rows").value);
    const numberOfColumns = parseInt(document.getElementById("js-input-columns").value);
    const padding = parseInt(document.getElementById("js-input-padding").value);

    const centerShiftX = Math.round( (svgWidth - 2*padding)/numberOfColumns );
    const centerShiftY = Math.round( (svgHeight - 2*padding)/numberOfRows );
  
    let count = 0;
    const shiftPercent = 0.07;
    let centerX = Math.round( padding+centerShiftX/2 + random(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) );
    let centerY = Math.round( padding+centerShiftY/2 + random(centerShiftY*shiftPercent*-1, centerShiftY*shiftPercent) );


    let perlinDotsHtml = '';

    for (let i = 0; i < numberOfRows; i++) {
        
        //print(CenterX);
        //print("\r\n");
        let randomColorIndex = getRandomInt(colorCodes.length-1);
        _perlinDot.fillColor = colorCodes[randomColorIndex]; 
        for (let j = 0; j < numberOfColumns; j++) {
            const dotHtml = _perlinDot.render(centerX, centerY, _perlinDot.direction);
            _svgDotsHtmlList.push(dotHtml);
            perlinDotsHtml += dotHtml;
            count += 1;
            centerX += centerShiftX + parseInt( Math.round( random(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) ));
        }
        centerY += centerShiftY + parseInt( Math.round( random(centerShiftY*shiftPercent*-1, centerShiftY*shiftPercent) ));
        centerX = parseInt( Math.round( padding + centerShiftX/2 + random(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) ));
    }
    drawSvg(perlinDotsHtml , true);

};




document.getElementById("js-svg").onclick = addPerlinCircle;
document.getElementById("js-btn-undo").onclick = (e) => { undoDraw(_svgDotsHtmlList, _svgDotsHtmlListUndo, drawSvg); };
document.getElementById("js-btn-redo").onclick = (e) => { redoDraw(_svgDotsHtmlList, _svgDotsHtmlListUndo, drawSvg); };
document.getElementById("js-btn-save").onclick = (e) => { saveSVG(_svg); };
document.getElementById("js-select-aspectRatio").onchange = (e) => { setupSvgCanvas(_menuBreakpoint, e.target.value); };
_htmlInputs.rangeNumberOfColors.oninput = (e) => { updateColors(e.target.value); };


document.getElementById("js-btn-create").onclick = createDots;


setupSvgCanvas(_menuBreakpoint, _svgAspectRatio);
updateColors(_htmlInputs.rangeNumberOfColors.value);