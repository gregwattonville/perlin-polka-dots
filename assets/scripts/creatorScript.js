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

    let copyOfColorArr = _colorCodes.slice(0, _numberOfColors);

    let perlinDotsHtml = '';

    for (let i = 0; i < _creatorOptions.numberOfRows; i++) {
        const minY = yStart + i*ySpacing; 
        const maxY = yStart + (i+1)*ySpacing;
        centerY = getRandomIntInclusive( minY, maxY );
        
        // if out of colors recopy source array
        if(!copyOfColorArr.length) {
            copyOfColorArr = _colorCodes.slice(0, _numberOfColors);
        }
        let randomColorIndex = getRandomInt(copyOfColorArr.length);
        _perlinDot.fillColor = copyOfColorArr[randomColorIndex]; 
        copyOfColorArr.splice(randomColorIndex, 1);
        console.log( copyOfColorArr );
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
        // Calc size plus randomness
        let randomSizeAdjustment = getRandomIntInclusive(_numberOfMoreRandomSizes, -_numberOfMoreRandomSizes);
        let dotSize = _creatorOptions.size + randomSizeAdjustment;

        if (dotSize > 0) {
            _perlinDot.minSize = dotSize;
        } else {
            _perlinDot.minSize = 1;
        }

        // Update number of segments and variance based on new size
        _perlinDot.calcSegments(_perlinDot.minSize);
        _perlinDot.calcVariance(_perlinDot.minSize);

        let randomDotBorderAdjustment = getRandomInt(_numberOfMoreRandomDotBorder);
        _perlinDot.maxSize += randomDotBorderAdjustment;

        // Calc number of columns/dots plus randomness
        // If dot size bigger ADD randomness
        // If dot size smaller SUBTRACT randomness
        let randomNumberOfDotsAdjustment = getRandomInt(_numberOfMoreRandomDots);
        let numberOfDotsInRow = _creatorOptions.numberOfColumns;
        if ( _perlinDot.minSize < _creatorOptions.size ) {
            numberOfDotsInRow = numberOfDotsInRow + randomNumberOfDotsAdjustment
        } else if ( _perlinDot.minSize > _creatorOptions.size ) {
            numberOfDotsInRow = numberOfDotsInRow - randomNumberOfDotsAdjustment
        }

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