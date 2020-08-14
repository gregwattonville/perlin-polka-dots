class PerlinDotSVG extends p5 {
    constructor(segments = 50, noiseScale = 0.5, timeScale = 0.01, timeDiff = 1000, minSize = 10, maxSize = 10, fillColor = '#808080', style = 0) {
        super();
        this.segments = segments;
        this.noiseScale = noiseScale;
        this.timeScale = timeScale;
        this.timeDiff = timeDiff;
        this.minSize = minSize;
        this.maxSize = maxSize;
        this.fillColor = fillColor;
        this.style = style;
        this.styles = ['filled', 'outline', 'star'];
    }

    render(x, y, setDirection = 0) {
        const timeUnique = Math.random(this.timeDiff);
        const numberOfAngles = 2*Math.PI/this.segments;
        const directions = [-1, 1];
        let direction = directions[ this.getRandomInt(2) ];;
        if (setDirection === 1) {
            direction = 1;
        } else if (setDirection === -1) {
            direction = -1;
        }

        noiseDetail(8, 0.5);
        
        let vertexList = [];

        for (let s = 0; s < this.segments+1; s++) {
                const deltaVertex = this.findNextCoords(s, numberOfAngles, this.minSize, this.maxSize, timeUnique, direction);    
                const vertexX = x +deltaVertex.dx;
                const vertexY = y +deltaVertex.dy;
                vertexList.push(`${vertexX},${vertexY}`);
        }

        if (this.styles[this.style] == 'outline') {
            return `<polygon points="${vertexList.join(' ')}" fill="none" stroke="${this.fillColor}" stroke-width="1.5" />`;
        } else {
            return `<polygon points="${vertexList.join(' ')}" fill="${this.fillColor}" />`;
        }
    }

    findNextCoords(currentSegment, numberOfAngles,  minRad, maxRad, time, direction) {

        const angle = numberOfAngles * currentSegment * direction;
        const cosAngle = cos(angle);
        const sinAngle = sin(angle);

        const noiseX = this.noiseScale * cosAngle + this.noiseScale;
        const noiseY = this.noiseScale * sinAngle + this.noiseScale;
        
        const noiseValue = noise(noiseX, noiseY, time);

        const rad = maxRad * noiseValue + minRad;

        const dx = rad * cosAngle;
        const dy = rad * sinAngle;

        return {dx: dx, dy: dy};
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    calcSegments(size) {
        this.segments = 0.0000105939 * Math.pow(size, 3) - 0.00834257 * Math.pow(size, 2) + 2.48002 * size + 24.7762;
    }

    calcVariance(size) {
        this.maxSize = 0.00000846098 * Math.pow(size, 3) - 0.00457477 * Math.pow(size, 2) + 0.845634 * size + 1.99935;
    }

}
