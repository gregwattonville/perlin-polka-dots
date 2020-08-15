document.getElementById("js-svg").onclick = addDot;
document.getElementById("js-btn-undo").onclick = (e) => { undoDraw(_svgDotsHtmlList, _svgDotsHtmlListUndo, drawSvg); };
document.getElementById("js-btn-redo").onclick = (e) => { redoDraw(_svgDotsHtmlList, _svgDotsHtmlListUndo, drawSvg); };
document.getElementById("js-btn-save").onclick = (e) => { saveSVG(_svg); };
document.getElementById("js-btn-clear").onclick = clearSvg;
document.getElementById("js-select-aspectRatio").onchange = (e) => { setupSvgCanvas(_menuBreakpoint, e.target.value); };
document.getElementById("js-select-dotStyle").onchange = (e) => { _perlinDot.style = parseInt(e.target.value); };
_htmlInputs.rangeNumberOfColors.oninput = (e) => { updateColors(e.target.value); };
_htmlInputs.rangeMoreRandomSizes.oninput = (e) => { updateMoreRandomSizes(e.target.value); };
_htmlInputs.rangeMoreRandomDots.oninput = (e) => { updateMoreRandomDots(e.target.value); };
_htmlInputs.rangeMoreRandomDotBorder.oninput = (e) => { updateMoreRandomDotBorder(e.target.value); };


document.getElementById("js-btn-create").onclick = createDots;
document.getElementById("js-btn-create2").onclick = createDotsRandom;
document.getElementById("js-btn-create3").onclick = createDotsPerlin;


setupSvgCanvas(_menuBreakpoint, _svgAspectRatio);
updateColors(_htmlInputs.rangeNumberOfColors.value);
updateMoreRandomSizes(_htmlInputs.rangeMoreRandomSizes.value);
updateMoreRandomDots(_htmlInputs.rangeMoreRandomDots.value);
updateMoreRandomDotBorder(_htmlInputs.rangeMoreRandomDotBorder.value);