'use strict'

function move(x, y, board){
    let cell = board[y][x]
    if(cell.flag || cell.shouldShow || cell.reveal) return board
    // lost game
    if(cell.mine) showAll(board)

    // show nearbyg
    if(!cell.nearbyMines) showNearbyCells(x, y, board)

    // show this cell only
    board[y][x].shouldShow = true
    return board
}

function showNearbyCells(x, y, board){
    getNearbyCells(y,x,board).forEach(function(nearbyCell) {
        let boardCell = board[nearbyCell.yCoordinate][nearbyCell.xCoordinate]
        if(!nearbyCell.nearbyMines && !boardCell.shouldShow){
            boardCell.shouldShow = true
            showNearbyCells(nearbyCell.xCoordinate, nearbyCell.yCoordinate, board)
        }
        boardCell.shouldShow = true
    });
}

function showAll(board){
    board.forEach(function(row){
        row.forEach(function(cell){
            cell.reveal = true
        })
    })
}
