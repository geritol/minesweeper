function render(board){
    range(rows + 1).map(function(i){
        let nextStartingYCoordinate = cellSize * i + separatorLineThickness * i
        context.fillStyle = '#808080'
        context.fillRect(0,nextStartingYCoordinate, width, separatorLineThickness)
    })
    range(columns + 1).map(function(i){
        let nextStartingXCoordinate = cellSize * i + separatorLineThickness * i
        context.fillStyle = '#808080'        
        context.fillRect(nextStartingXCoordinate, 0, separatorLineThickness, height)
    })
    board.forEach(function(row, i) {
       row.forEach(function(cell, j){
           fillCell(j, i, '#bdbdbd')
       })
    });
}

function drawMine(x,y){
    let mineImage = document.getElementById('mine')
    fillCell(x,y, 'red')   
    let [xPx, yPx] = coordinatesToPixel(x,y)
    context.drawImage(mineImage,xPx,yPx, cellSize, cellSize);
}

function drawFlag(x,y){
    let flagImage = document.getElementById('flag')
    let [xPx, yPx] = coordinatesToPixel(x,y)
    context.drawImage(flagImage,xPx,yPx, cellSize, cellSize);
}

function fillCell(x,y, color){
    let [xPx, yPx] = coordinatesToPixel(x,y)
    context.fillStyle = color;     
    context.fillRect(xPx, yPx, cellSize, cellSize)
}

function drawNumber(x,y, num){
    let [xPx, yPx] = coordinatesToPixel(x,y)

    context.font= cellSize +"px monospace";
    const colors = {
        1: '#0000ff',
        2: '#070',
        3: '#ff0000',
        4: '#00007b',
        5: '#7a0000',
        6: '#008080',
        7: '#000000',
        8: '#808080'
    }
    context.fillStyle= colors[num];    
    
    let textWidth = context.measureText(num).width
    
    context.fillText(num , xPx + cellSize/2 - (textWidth / 2), yPx + cellSize/6*5 );
}

function coordinatesToPixel(x,y){
    let xPx = cellSize * x + separatorLineThickness * (x + 1)
    let yPx = cellSize * y + separatorLineThickness * (y + 1)
    return [xPx, yPx]
}