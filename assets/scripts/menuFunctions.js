function undoDraw(svgHtmlList, svgHtmlListUndo, callback) {
    if (svgHtmlList.length){
        svgHtmlListUndo.push(svgHtmlList.pop());
        callback(svgHtmlList.join(''));
    } else {
        return false;
    }
}

function redoDraw(svgHtmlList, svgHtmlListUndo, callback) {
    if (svgHtmlListUndo.length){
        svgHtmlList.push(svgHtmlListUndo.pop());
        callback(svgHtmlList.join(''));
    } else {
        return false;
    }
}

function saveSVG(svgEl) {
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