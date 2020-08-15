const createDots = () => {

    updateGeneralOptions();
    updateDotOptions();  
    updateCreatorOptions();
    updateColorOptions();

    let centerShiftX = Math.round( (_svgWidth - 2*_creatorOptions.padding)/_creatorOptions.numberOfColumns );
    const centerShiftY = Math.round( (_svgHeight - 2*_creatorOptions.padding)/_creatorOptions.numberOfRows );
  
    let count = 0;
    const shiftPercent = 0.07;
    const paddingAdjustment = _creatorOptions.padding/(_creatorOptions.numberOfColumns - 1);
    let centerX = 0
    let centerY = 0


    let perlinDotsHtml = '';

    for (let i = 0; i < _creatorOptions.numberOfRows; i++) {

        creatorHandleDotSize();
        creatorHandleBorderRandomness();

        let numberOfDotsInRow = getAndHandleNumberOfDotsInRow();

        centerShiftX = Math.round( (_svgWidth - 2*_creatorOptions.padding)/numberOfDotsInRow );

        centerY += centerShiftY + parseInt( Math.round( random(centerShiftY*shiftPercent*-1, centerShiftY*shiftPercent) ));
        centerX = parseInt( Math.round( _creatorOptions.padding + centerShiftX/2 + random(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) ));
        
        _perlinDot.fillColor = getColorValue(_useRandomColors); 
        for (let j = 0; j < numberOfDotsInRow; j++) {
            const dotHtml = _perlinDot.render(centerX, centerY, _perlinDot.direction);
            _svgDotsHtmlList.push(dotHtml);
            _svgDotsHtmlListHistory.push(dotHtml);
            perlinDotsHtml += dotHtml;
            count += 1;
            centerX += centerShiftX + parseInt( Math.round( random(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) ) - paddingAdjustment) ;
        }
        
    }
    drawSvg(perlinDotsHtml, true);

};


const createDotsRandom = () => {

    updateGeneralOptions();
    updateDotOptions();  
    updateCreatorOptions();  
    updateColorOptions();
  
    let count = 0;

    const widthMinusPadding = _svgWidth - 2*_creatorOptions.padding
    const xStart = _creatorOptions.padding;
    let xSpacing = widthMinusPadding / _creatorOptions.numberOfColumns;
    const heightMinusPadding = _svgHeight - 2*_creatorOptions.padding
    const yStart = _creatorOptions.padding;
    const ySpacing = heightMinusPadding / _creatorOptions.numberOfRows;

    let centerX = getRandomIntInclusive( xStart, xStart+xSpacing );
    let centerY = getRandomIntInclusive( yStart, yStart+ySpacing );

    let perlinDotsHtml = '';

    for (let i = 0; i < _creatorOptions.numberOfRows; i++) {
        const minY = yStart + i*ySpacing; 
        const maxY = yStart + (i+1)*ySpacing;
        centerY = getRandomIntInclusive( minY, maxY );

        creatorHandleDotSize();
        creatorHandleBorderRandomness();
        let numberOfDotsInRow = getAndHandleNumberOfDotsInRow();
        
        xSpacing = widthMinusPadding / numberOfDotsInRow;

        _perlinDot.fillColor = getColorValue(_useRandomColors); 

        for (let j = 0; j < numberOfDotsInRow; j++) { 
           
            const minX = xStart + j*xSpacing; 
            const maxX = xStart + (j+1)*xSpacing;
            centerX = getRandomIntInclusive( minX, maxX );

            const dotHtml = _perlinDot.render(centerX, centerY, _perlinDot.direction);

            count += 1;
            _svgDotsHtmlList.push(dotHtml);
            _svgDotsHtmlListHistory.push(dotHtml);
            perlinDotsHtml += dotHtml;
        }
        
    }
    drawSvg(perlinDotsHtml, true);

};

const createDotsPerlin = () => {
    clearSvg();
    updateGeneralOptions();
    //updateDotOptions();  
    updateCreatorOptions();
    updateColorOptions();

    console.log('SVG Width: ', _svgWidth);

  
    let count = 0;
    const shiftPercent = 0.07;
    const paddingAdjustment = _creatorOptions.padding/(_creatorOptions.numberOfColumns);
    let centerX = 0;
    let centerY = 0;

    const centerShiftY = Math.round( (_svgHeight - 2*_creatorOptions.padding)/_creatorOptions.numberOfRows );

    

    let perlinDotsHtml = '';

    for (let i = 0; i < _creatorOptions.numberOfRows; i++) {
        
        creatorHandleDotSize();
        creatorHandleBorderRandomness();
        
        let numberOfDotsInRow = getAndHandleNumberOfDotsInRow();

        // calculate centerShiftX based on random number of dots
        let centerShiftX = Math.round( (_svgWidth - 2*_creatorOptions.padding)/numberOfDotsInRow );
        
        // start row
        centerY += centerShiftY + parseInt( Math.round( random(centerShiftY*shiftPercent*-1, centerShiftY*shiftPercent) ));
        // Reset X
        if (!(i%2)) { // X Left
            centerX = parseInt( Math.round( _creatorOptions.padding + centerShiftX/2 + random(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) ));
        } else { // X Right
            centerX = parseInt(Math.round( _svgWidth - _creatorOptions.padding/2 - centerShiftX/2 + random(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) ));
        }
        
        let colorCode = getColorValue(_useRandomColors);
        _perlinDot.fillColor = colorCode; 
        
        for (let j = 0; j < numberOfDotsInRow; j++) {
            const n = noise(count);
            const dotHtml = _perlinDot.render(centerX, centerY+25*n-25, _perlinDot.direction);
            _svgDotsHtmlList.push(dotHtml);
            _svgDotsHtmlListHistory.push(dotHtml);
            perlinDotsHtml += dotHtml;
            count += 1;
            if (!(i%2)) { // Left to right
                centerX += centerShiftX + parseInt( Math.round( random(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) ) - paddingAdjustment);
            } else { // Right to left
                centerX -= centerShiftX - parseInt( Math.round( random(centerShiftX*shiftPercent*-1, centerShiftX*shiftPercent) ) - paddingAdjustment);
            }
        }
        
    }
    drawSvg(perlinDotsHtml, true);

};