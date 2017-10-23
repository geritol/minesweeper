function getNearbyCells(rowIndex, columnIndex, board){
    let yDeltas = range(-1,2)
    let xDeltas = range(-1,2)
    let nearbyCells = []

    yDeltas.forEach(function(yDelta){
        xDeltas.forEach(function(xDelta){
            // if we have the current cell, we don't want to go further
            if(yDelta === 0 && xDelta === 0) return
            let nearbyY = rowIndex + yDelta
            let nearbyX = columnIndex + xDelta
            if(nearbyX < 0 || nearbyY < 0) return
            if(nearbyY + 1 > board.length || nearbyX + 1 > board[0].length) return
            let nearbyCell = JSON.parse(JSON.stringify(board[nearbyY][nearbyX]))
            nearbyCell.xCoordinate = nearbyX
            nearbyCell.yCoordinate = nearbyY
            nearbyCells.push(nearbyCell)
        })
    })

    return nearbyCells
}


function coordinatesToPixel(x,y, {cellSize, separatorLineThickness}){
    let xPx = cellSize * x + separatorLineThickness * (x + 1)
    let yPx = cellSize * y + separatorLineThickness * (y + 1)
    return [xPx, yPx]
}

function pixelToCoordinates(xPx, yPx, {cellSize, separatorLineThickness}){
    let x = Math.floor(xPx/(cellSize + separatorLineThickness))
    let y = Math.floor(yPx/(cellSize + separatorLineThickness))
    return [x,y]
}

function range(lower, upper){
    if(!upper){
        upper = lower
        lower = 0
    }
    return Array.apply(null, Array(upper + Math.abs(lower))).map(function (_, j) {return j + lower;});
}
