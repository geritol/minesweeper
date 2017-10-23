function move(x,y, board){
    let cell = board[y][x]
    
    // no ations are needed
    if(cell.flag || cell.shouldShow || cell.reveal) return board

    // lost game
    if(cell.mine){
      cell.shouldShow = true
      revealAll(board)
    }

    // show nearby
    if(!cell.nearbyMines) showNearbyCells(x,y,board)

    // show this cell only
    cell.shouldShow = true
    return board
}

function showNearbyCells(x,y, board){
    getNearbyCells(y,x,board).forEach(function(nearbyCell) {
        let boardCell = board[nearbyCell.yCoordinate][nearbyCell.xCoordinate]
        if(!nearbyCell.nearbyMines && !boardCell.shouldShow){
            boardCell.shouldShow = true
            showNearbyCells(nearbyCell.xCoordinate, nearbyCell.yCoordinate, board)
        }
        boardCell.shouldShow = true
    });
}

function revealAll(board){
    board.forEach(function(row){
        row.forEach(function(cell){
            cell.reveal = true
        })
    })
}
