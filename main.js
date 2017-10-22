'use strict'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const config = {
  rows: 6,
  columns: 6,
  cellSize: 30,
  mineCount: 30,
  separatorLineThickness: 2
}

config.width = calculateBoardSize(config.columns, config)
config.height = calculateBoardSize(config.rows, config)

canvas.height = config.height
canvas.width = config.width

function calculateBoardSize(dimension, {cellSize, separatorLineThickness}){
    // calculates the height or width in px of the board
    // dimension row or column count of the board
    return cellSize * dimension + separatorLineThickness * (dimension + 1)
}

function generateNewBoard(rows, columns, mines){
    let board = range(rows).map(function(){return range(columns).map(function(){return {}})})
    let mineCoordinates = []
    let mineCoordinatesIndex = {}
    while(mineCoordinates.length < mines){
        const cellCount = rows * columns
        if(mineCoordinates.length === cellCount){
          throw new Error('More mines specified than cells!')
        }
        let x = Math.floor(Math.random() * columns)
        let y = Math.floor(Math.random() * rows)
        if(!mineCoordinatesIndex[String([x,y])]){
            mineCoordinatesIndex[String([x,y])] = 1
            mineCoordinates.push([x,y])
            board[y][x].mine = true
        }
    }
    board.forEach(function(row, rowIndex){
        row.map(function(cell, columnsIndex){
            cell = calculateNearbyMines(rowIndex, columnsIndex, board)
        })
    })
    return board
}


function calculateNearbyMines(rowIndex, columnIndex, board){
    let cell = board[rowIndex][columnIndex]
    if(cell.mine) return cell
    let nearbyMinesCount = 0
    getNearbyCells(rowIndex, columnIndex, board).forEach(function(cell){
        if(cell.mine) nearbyMinesCount += 1
    })
    cell.nearbyMines = nearbyMinesCount
    return cell
}

function getNearbyCells(rowIndex, columnIndex, board){
    let yDeltas = range(-1, 2)
    let xDeltas = range(-1, 2)
    let nearbyCells = []

    yDeltas.forEach(function(yDelta){
        xDeltas.forEach(function(xDelta){
            // if we have the current cell, we don't want to go further
            if(yDelta === 0 && xDelta === 0) return
            let nearbyY = rowIndex + yDelta
            let nearbyX = columnIndex + xDelta
            if(nearbyX < 0 || nearbyY < 0) return
            if(nearbyY + 1 > board.length || nearbyX + 1 > board[0].length) return
            let nearbyCell = board[nearbyY][nearbyX]
            nearbyCell.xCoordinate = nearbyX
            nearbyCell.yCoordinate = nearbyY
            nearbyCells.push(nearbyCell)
        })
    })
    return nearbyCells
}

function range(lower, upper){
    if(!upper){
        upper = lower
        lower = 0
    }
    return Array.apply(null, Array(upper + Math.abs(lower))).map(function (_, j) {return j + lower;});
}

function leftClickEvent(event){
    let [x,y] = pixelToCoordinates(event.offsetX, event.offsetY, config)
    board = move(x,y, board)
    render(board, config)
}.bind(window)

function rightClickEvent(event){
    event.preventDefault()
    let [x,y] = pixelToCoordinates(event.offsetX, event.offsetY, config)
    let cell = board[y][x]
    if(!cell.shouldShow && !cell.reveal) cell.flag = !cell.flag
    render(board, config)
}.bind(window)

// init

let board = generateNewBoard(config.rows, config.columns, config.mineCount)
canvas.addEventListener('click', clickEvent)
canvas.addEventListener('contextmenu', rightClickEvent)
render(board, config)
