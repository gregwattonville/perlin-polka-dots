// Ratios
// 1.5, 24x36 Resolution of 5400x3600
// 1.5, 32x48 Resolution of 3200x4800
// 1, 48x48 Resolution of 4800x4800

//const _p5 = new p5();
const _svg = document.getElementById('js-svg');
const _topHeader = document.getElementById('js-div-topHeader');
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
let _colorCodes = ['#000000', '#808080', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#000000', '#F5F5F5'];
const _perlinDot = new PerlinDotSVG();
_numberOfMoreRandomSizes = null;
_numberOfMoreRandomDots = null;
_numberOfMoreRandomDotBorder = null;


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
    _svgDotsHtml = '';
    _svgDotsHtmlList = [];
    _svg.innerHTML = '';
}

const updateGeneralOptions = () => {
    const box = _svg.viewBox.baseVal;
    _svgWidth = box.width;
    _svgHeight = box.height;
    //_svgWidth = _svg.clientWidth;
    //_svgHeight = _svg.clientHeight;
}

const updateCreatorOptions = () => {
    _creatorOptions.size = parseInt(document.getElementById("js-input-creator-size").value);
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
_htmlInputs.rangeMoreRandomSizes = document.getElementById("js-range-moreRandomSizes");
_htmlInputs.rangeMoreRandomDots = document.getElementById("js-range-moreRandomDots");
_htmlInputs.rangeMoreRandomDotBorder = document.getElementById("js-range-moreRandomDotBorder");


function drawSvg(svgHtml, updateGlobalHtml = false) {
    if(updateGlobalHtml) {
        _svgDotsHtml = svgHtml
    }
    _svg.innerHTML = svgHtml;
}


const updateColors = (rangeVal) => {
    _numberOfColors = rangeVal;
    document.getElementById('js-span-selectedColorsRange').innerHTML = rangeVal;
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

const updateMoreRandomSizes = (rangeVal) => {
    _numberOfMoreRandomSizes = parseInt(rangeVal);
    document.getElementById('js-span-moreRandomSizes').innerHTML = rangeVal;
};

const updateMoreRandomDots = (rangeVal) => {
    _numberOfMoreRandomDots = parseInt(rangeVal);
    document.getElementById('js-span-moreRandomDots').innerHTML = rangeVal;
};

const updateMoreRandomDotBorder = (rangeVal) => {
    _numberOfMoreRandomDotBorder = parseInt(rangeVal);
    document.getElementById('js-span-moreRandomDotBorder').innerHTML = rangeVal;
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








