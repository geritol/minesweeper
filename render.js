function render(board, {cellSize, separatorLineThickness, width, height}){
    let rows = board.length
    let columns = board[0].length
    // draw row separators
    range(rows + 1).map(function(i){
        let nextStartingYCoordinate = cellSize * i + separatorLineThickness * i
        context.fillStyle = '#808080'
        context.fillRect(0,nextStartingYCoordinate, width, separatorLineThickness)
    })
    // draw column separators
    range(columns + 1).map(function(i){
        let nextStartingXCoordinate = cellSize * i + separatorLineThickness * i
        context.fillStyle = '#808080'
        context.fillRect(nextStartingXCoordinate, 0, separatorLineThickness, height)
    })
    // draw cells
    board.forEach(function(row, i) {
       row.forEach(function(cell, j){
           if(cell.shouldShow || cell.reveal){
                if(!cell.reveal) fillCell(j, i, '#f0f0f0')
                if(cell.mine){
                    drawMine(j,i)
                    return
                }
                if(cell.nearbyMines){
                    drawNumber(j,i, cell.nearbyMines)
                    return
                }
           }else{
                if(cell.flag){
                    drawFlag(j,i)
                    return
                }else{
                    fillCell(j, i, '#bdbdbd')
                }
           }
       })
    });
}

function drawMine(x,y, {cellSize}){
    let mineImage = document.getElementById('mine')
    fillCell(x,y, 'red')
    let [xPx, yPx] = coordinatesToPixel(x,y)
    context.drawImage(mineImage,xPx,yPx, cellSize, cellSize);
}

function drawFlag(x,y, {cellSize}){
    let flagImage = document.getElementById('flag')
    let [xPx, yPx] = coordinatesToPixel(x,y)
    context.drawImage(flagImage,xPx,yPx, cellSize, cellSize);
}

function fillCell(x,y, color, {cellSize}){
    let [xPx, yPx] = coordinatesToPixel(x,y)
    context.fillStyle = color;
    context.fillRect(xPx, yPx, cellSize, cellSize)
}

function drawNumber(x,y, num, {cellSize, separatorLineThickness}){
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

function pixelToCoordinates(xPx, yPx){
    let x = Math.floor(xPx/(cellSize + separatorLineThickness))
    let y = Math.floor(yPx/(cellSize + separatorLineThickness))
    return [x,y]
}
