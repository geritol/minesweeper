'use strict'
/*
  Board: 2d Array containing cells
  Example:
  [
  [{"nearbyMines":0},{"nearbyMines":1},{"nearbyMines":1}],
  [{"nearbyMines":0},{"nearbyMines":2},{"mine":true}],
  [{"nearbyMines":0},{"nearbyMines":2},{"mine":true}]
  ]
  ------------
  Cell: object
  Properties:
    nearbyMines: Integer (0-8)
    mine: Boolean
    flag: Boolean
    shouldShow: Boolean
    reveal: Boolean
 */

function generateNewBoard(rows, columns, mineCountToGenerate){
  /*
    IN: rowCount (integer), columnCount (integer), mineCountToGenerate (integer)
    OUT: board (2d array), contains cells (object) {mine: Boolean, Integer}
    DESC: Crerates a board, fills it with mines, and calculates nearby mine counts for cells
  */

    // create empty board
    let board = range(rows).map(function(){return range(columns).map(function(){return {}})})

    // add mines to the board
    // TODO: write and use generateMineCoordinates function
    const mineCoordinates = generateMineCoordinates(rows, columns, mineCountToGenerate)

    mineCoordinates.forEach(function(coordinatePair){
      const [x, y] = coordinatePair
      board[x][y] = {mine: true}
    })

    // calculate nearby mine counts
    // TODO: write and use calculateNearbyMines function
    board.forEach(function(row, rowIndex){
        row.map(function(cell, columnsIndex){
            cell = calculateNearbyMines(rowIndex, columnsIndex, board)
        })
    })
    return board
}

function generateMineCoordinates(columns, rows, mineCountToGenerate){
  /*
    IN: rowCount (integer), columnCount (integer), mineCountToGenerate (integer)
    OUT: mineCoordinates (array), contains coordinate of mines: [[3,4],[4,6]]
    DESC: Crerates an array, that contains the coordinates of all the mines. All mine have to be unique coordinate.
  */
  const cellCount = rows * columns
  if(mineCountToGenerate > cellCount){
    throw new Error('More mines specified than cells!')
  }
  let mineCoordinates = []
  let mineCoordinatesIndex = {}

  // generate random coordinates until reach the necessary number of mines.
  while(mineCoordinates.length < mineCountToGenerate){
      let x = Math.floor(Math.random() * columns)
      let y = Math.floor(Math.random() * rows)
  // check if the new generated coordinate is unique
      if(!mineCoordinatesIndex[String([x,y])]){
          mineCoordinatesIndex[String([x,y])] = 1
          mineCoordinates.push([x,y])
      }
  }
  return mineCoordinates
}

function calculateNearbyMines(rowIndex, columnIndex, board){
  /*
    IN: rowCount (integer), columnCount (integer), board (2d array)
    OUT: cell (object) posible value {"nearbyMines":0..8} or {"mine":true}
    DESC: Creates an object, that contains the information regarding one cell
  */

    const cell = board[rowIndex][columnIndex]
    if(cell.mine) return cell

    let nearbyMinesCount = 0


    // Use getNearbyCells helper function to get all the nearby cells
    // count the ones that have mines
    getNearbyCells(rowIndex, columnIndex, board).forEach(function(cell){
        if(cell.mine) nearbyMinesCount += 1
    })

    cell.nearbyMines = nearbyMinesCount
    return cell
}

function getNearbyCells(rowIndex, columnIndex, board){
  /*
    IN: rowIndex (integer), columnIndex (integer), board (2d array)
    OUT: list of cells
    DESC: return cells that share an edge or a corner with the input cell
  */
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

function handleClick(event){
  /*
    IN: event left click
    OUT: void
    DESC: based on mouse click's place recalculate table and render it
    SIDEEFFECT: re-renders the board
  */

  // use pixelToCoordinates helper to get the coordiante
  let [x,y] = pixelToCoordinates(event.offsetX, event.offsetY, config)

  //use the move function to evaluate the action
  board = move(x, y, board)
  //render the board
  render(board, config)
}

function handleRightClick(event){
  /*
    IN: event right click
    OUT: void
    DESC: based on the mouse click's place toggle cell.flag if necessary
    SIDEEFFECT: re-renders the board
  */
  // hint event.preventDefault() could be useful
  event.preventDefault()
  let [x,y] = pixelToCoordinates(event.offsetX, event.offsetY, config)
  let cell = board[y][x]
  if(!cell.shouldShow && !cell.reveal){
      cell.flag = !cell.flag
  }
  render(board, config)
}

function move(x, y, board){
  /*
    IN: x (integer), y (integer), board (2d array)
    OUT: board (2d array), contains cells (object) {mine: Boolean, Integer}
    DESC: apply changes to the game state based on the clicked cells content
  */
    let cell = board[y][x]

    if(cell.flag || cell.shouldShow || cell.reveal) return board

    // if the cell has a mine, the game is lost show this cell, reveal all cells
    if(cell.mine){
      cell.shouldShow = true
      revealAll(board)
      return board
    }

    // if cells has no mines nearby, show nearby cells, use showNearbyCells function
    if(!cell.nearbyMines) showNearbyCells(x,y,board)

    // show this cell only
    cell.shouldShow = true
    return board
}

function showNearbyCells(x, y, board){
  /*
    IN: x (integer), y (integer), board (2d array)
    OUT: board or void
    DESC: recrusivley check nearby cells and show them if empty
  */

  // use getNearbyCells from helper
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
  /*
    IN:  board (2d array)
    OUT: board or void
    DESC: reveal all cell, used when game is lost
  */
    board.forEach(function(row){
        row.forEach(function(cell){
            cell.reveal = true
        })
    })
}
