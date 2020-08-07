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
let _svgWidth = null;
let _svgHeight = null;

let _creatorOptions = {};
let _numberOfColors = null;
let _colorCodes = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#000000', '#F5F5F5'];
const _perlinDot = new PerlinDotSVG();


let _circleColor = document.getElementById("js-input-color").value


const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}


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

const clearSvg = () => {
    _svg.innerHTML = '';
}

const updateGeneralOptions = () => {
    _svgWidth = _svg.clientWidth;
    _svgHeight = _svg.clientHeight;
}

const updateCreatorOptions = () => {
    _creatorOptions.numberOfRows = parseInt(document.getElementById("js-input-rows").value);
    _creatorOptions.numberOfColumns = parseInt(document.getElementById("js-input-columns").value);
    _creatorOptions.padding = parseInt(document.getElementById("js-input-padding").value);
}

const updateDotOptions = () => {
    _perlinDot.fillColor = document.getElementById("js-input-color").value;
    //console.log('Color: ',document.getElementById("js-input-color").value);
    _perlinDot.segments = parseInt(document.getElementById("js-input-segments").value);
    //console.log('Segments: ', parseInt(document.getElementById("js-input-segments").value));
    _perlinDot.minSize = parseInt(document.getElementById("js-input-minSize").value);
    //console.log('minSize: ',document.getElementById("js-input-minSize").value);
    _perlinDot.maxSize = parseInt(document.getElementById("js-input-maxSize").value);
    //console.log('maxSize: ',document.getElementById("js-input-maxSize").value);
    _perlinDot.direction = parseInt(document.getElementById("js-select-direction").value);
}

const updateColorOptions = () => {
    for (let i = 0; i < _numberOfColors; i++) {
        _colorCodes[i] = document.getElementById(`js-input-color-${i}`).value;
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


const updateColors = (rangeVal) => {
    _numberOfColors = rangeVal;
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
                            <input type="color" class="form-control form-control-color" id="js-input-color-${i}" value="${_colorCodes[i]}" title="Choose your color">
                        </div>
                    </div>`;
        colorsHtml += colorSelectHtml;
    }
    _colorsDiv.innerHTML = colorsHtml;
    
};


const addDot = (e) => {
    
    updateDotOptions();

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


const createDots = () => {

    updateGeneralOptions();
    updateDotOptions();  
    updateCreatorOptions();
    updateColorOptions();

    const centerShiftX = Math.round( (_svgWidth - 2*_creatorOptions.padding)/_creatorOptions.numberOfColumns );
    const centerShiftY = Math.round( (_svgHeight - 2*_creatorOptions.padding)/_creatorOptions.numberOfRows );
  
    let count = 0;
    const shiftPercent = 0.07;
    const paddingAdjustment = _creatorOptions.padding/(_creatorOptions.numberOfColumns - 1);
    let centerX = Math.round( _creatorOptions.padding+centerShiftX/2 + random(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) );
    let centerY = Math.round( _creatorOptions.padding+centerShiftY/2 + random(centerShiftY*shiftPercent*-1, centerShiftY*shiftPercent) );


    let perlinDotsHtml = '';

    for (let i = 0; i < _creatorOptions.numberOfRows; i++) {
        
        //print(CenterX);
        //print("\r\n");
        let randomColorIndex = getRandomInt(_numberOfColors);
        _perlinDot.fillColor = _colorCodes[randomColorIndex]; 
        for (let j = 0; j < _creatorOptions.numberOfColumns; j++) {
            const dotHtml = _perlinDot.render(centerX, centerY, _perlinDot.direction);
            _svgDotsHtmlList.push(dotHtml);
            perlinDotsHtml += dotHtml;
            count += 1;
            centerX += centerShiftX + parseInt( Math.round( random(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) ) - paddingAdjustment) ;
        }
        centerY += centerShiftY + parseInt( Math.round( random(centerShiftY*shiftPercent*-1, centerShiftY*shiftPercent) ));
        centerX = parseInt( Math.round( _creatorOptions.padding + centerShiftX/2 + random(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) ));
    }
    drawSvg(perlinDotsHtml , true);

};


const createDotsRandom = () => {

    updateGeneralOptions();
    updateDotOptions();  
    updateCreatorOptions();  
    updateColorOptions();

    const centerShiftX = Math.round( (_svgWidth - 2*_creatorOptions.padding)/_creatorOptions.numberOfColumns );
    const centerShiftY = Math.round( (_svgHeight - 2*_creatorOptions.padding)/_creatorOptions.numberOfRows );
  
    let count = 0;
    const shiftPercent = 0.07;
    const paddingAdjustment = _creatorOptions.padding/(_creatorOptions.numberOfColumns - 1);
    const widthMinusPadding = _svgWidth - 2*_creatorOptions.padding
    const xStart = _creatorOptions.padding;
    const xSpacing = widthMinusPadding / _creatorOptions.numberOfColumns;
    const heightMinusPadding = _svgHeight - 2*_creatorOptions.padding
    const yStart = _creatorOptions.padding;
    const ySpacing = heightMinusPadding / _creatorOptions.numberOfRows;
    //let centerX = Math.round( padding+centerShiftX/2 + getRandomIntInclusive(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) );
    //let centerY = Math.round( padding+centerShiftY/2 + getRandomIntInclusive(centerShiftY*shiftPercent*-1, centerShiftY*shiftPercent) );
    let centerX = getRandomIntInclusive( xStart, xStart+xSpacing );
    let centerY = getRandomIntInclusive( yStart, yStart+ySpacing );


    let perlinDotsHtml = '';

    for (let i = 0; i < _creatorOptions.numberOfRows; i++) {
        const minY = yStart + i*ySpacing; 
        const maxY = yStart + (i+1)*ySpacing;
        centerY = getRandomIntInclusive( minY, maxY );
        //print(CenterX);
        //print("\r\n");
        let randomColorIndex = getRandomInt(_numberOfColors);
        _perlinDot.fillColor = _colorCodes[randomColorIndex]; 
        for (let j = 0; j < _creatorOptions.numberOfColumns; j++) { 
           //centerX += centerShiftX + parseInt( Math.round( getRandomIntInclusive(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) ) - paddingAdjustment) ;
           const minX = xStart + j*xSpacing; 
           const maxX = xStart + (j+1)*xSpacing;
           centerX = getRandomIntInclusive( minX, maxX );

           const dotHtml = _perlinDot.render(centerX, centerY, _perlinDot.direction);

           count += 1;
           _svgDotsHtmlList.push(dotHtml);
            perlinDotsHtml += dotHtml;
        }
        
    }
    drawSvg(perlinDotsHtml , true);

};

const createDotsPerlin = () => {

    updateGeneralOptions();
    updateDotOptions();  
    updateCreatorOptions();
    updateColorOptions();

    const centerShiftX = Math.round( (_svgWidth - 2*_creatorOptions.padding)/_creatorOptions.numberOfColumns );
    const centerShiftY = Math.round( (_svgHeight - 2*_creatorOptions.padding)/_creatorOptions.numberOfRows );
  
    let count = 0;
    const shiftPercent = 0.07;
    const paddingAdjustment = _creatorOptions.padding/(_creatorOptions.numberOfColumns - 1);
    let centerX = Math.round( _creatorOptions.padding+centerShiftX/2 + random(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) );
    let centerY = Math.round( _creatorOptions.padding+centerShiftY/2 + random(centerShiftY*shiftPercent*-1, centerShiftY*shiftPercent) );


    let perlinDotsHtml = '';

    for (let i = 0; i < _creatorOptions.numberOfRows; i++) {
        
        //print(CenterX);
        //print("\r\n");
        let randomColorIndex = getRandomInt(_numberOfColors);
        _perlinDot.fillColor = _colorCodes[randomColorIndex]; 
        for (let j = 0; j < _creatorOptions.numberOfColumns; j++) {
            const n = noise(count);
            const dotHtml = _perlinDot.render(centerX, centerY+25*n-25, _perlinDot.direction);
            _svgDotsHtmlList.push(dotHtml);
            perlinDotsHtml += dotHtml;
            count += 1;
            centerX += centerShiftX + parseInt( Math.round( random(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) ) - paddingAdjustment) ;
        }
        centerY += centerShiftY + parseInt( Math.round( random(centerShiftY*shiftPercent*-1, centerShiftY*shiftPercent) ));
        centerX = parseInt( Math.round( _creatorOptions.padding + centerShiftX/2 + random(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) ));
    }
    drawSvg(perlinDotsHtml , true);

};






document.getElementById("js-svg").onclick = addDot;
document.getElementById("js-btn-undo").onclick = (e) => { undoDraw(_svgDotsHtmlList, _svgDotsHtmlListUndo, drawSvg); };
document.getElementById("js-btn-redo").onclick = (e) => { redoDraw(_svgDotsHtmlList, _svgDotsHtmlListUndo, drawSvg); };
document.getElementById("js-btn-save").onclick = (e) => { saveSVG(_svg); };
document.getElementById("js-btn-clear").onclick = clearSvg;
document.getElementById("js-select-aspectRatio").onchange = (e) => { setupSvgCanvas(_menuBreakpoint, e.target.value); };
document.getElementById("js-select-dotStyle").onchange = (e) => { _perlinDot.style = parseInt(e.target.value); };
_htmlInputs.rangeNumberOfColors.oninput = (e) => { updateColors(e.target.value); };


document.getElementById("js-btn-create").onclick = createDots;
document.getElementById("js-btn-create2").onclick = createDotsRandom;
document.getElementById("js-btn-create3").onclick = createDotsPerlin;


setupSvgCanvas(_menuBreakpoint, _svgAspectRatio);
updateColors(_htmlInputs.rangeNumberOfColors.value);