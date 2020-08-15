// HTML inputs id's
let _htmlInputs = {};
_htmlInputs.drawButton = 'js-btn-draw';
_htmlInputs.rangeNumberOfColors = document.getElementById("js-range-numberOfColors");
_htmlInputs.rangeMoreRandomSizes = document.getElementById("js-range-moreRandomSizes");
_htmlInputs.rangeMoreRandomDots = document.getElementById("js-range-moreRandomDots");
_htmlInputs.rangeMoreRandomDotBorder = document.getElementById("js-range-moreRandomDotBorder");

const updateColors = (rangeVal) => {
    _useRandomColors = document.getElementById('js-color-input-useRandomColor').checked;

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

const clearSvg = () => {
    _svgDotsHtml = '';
    _svgDotsHtmlList = [];
    _svg.innerHTML = '';
}

const undoDraw = (svgHtmlList, svgHtmlListUndo, callback) => {
    if (svgHtmlList.length){
        svgHtmlListUndo.push(svgHtmlList.pop());
        callback(svgHtmlList.join(''), true);
    } else {
        return false;
    }
}

const redoDraw = (svgHtmlList, svgHtmlListUndo, callback) => {
    if (svgHtmlListUndo.length){
        svgHtmlList.push(svgHtmlListUndo.pop());
        callback(svgHtmlList.join(''), true);
    } else {
        return false;
    }
}

const saveSVG = (svgEl) => {
    const datetimeInt = new Date().getTime();
    const name = 'perlinPolkaDots_'+datetimeInt;
    const svgData = svgEl.outerHTML;
    const preface = '<?xml version="1.0" standalone="no"?>\r\n';
    const svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}