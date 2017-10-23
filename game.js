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
    // use generateMineCoordinates function
    const mineCoordinates = generateMineCoordinates(rows, columns, mineCountToGenerate)

    mineCoordinates.forEach(function(coordinatePair){
      const [x, y] = coordinatePair
      board[x][y] = {mine: true}
    })

    // calculate nearby mine counts
    // use calculateNearbyMines function
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

  // check if the new generated coordinate is unique
  while(mineCoordinates.length < mineCountToGenerate){
      let x = Math.floor(Math.random() * columns)
      let y = Math.floor(Math.random() * rows)
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
    OUT: cell (object) posiible value {"nearbyMines":0} or {"mine":true}
    DESC: Crerates an object, that contains the information regarding one cell
  */

  //Check if cell is not mine
    const cell = board[rowIndex][columnIndex]
    if(cell.mine) return cell

    let nearbyMinesCount = 0


    //Use getNearbyCells helper function to get all the nearby cell
    getNearbyCells(rowIndex, columnIndex, board).forEach(function(cell){
        if(cell.mine) nearbyMinesCount += 1
    })

    cell.nearbyMines = nearbyMinesCount
    return cell
}

function handleClick(event){
  /*
    IN: event left click
    OUT: void
    DESC: based on mouse click recalculate table and render it
  */

  // use pixelToCoordinates helper to get the coordiante
  let [x,y] = pixelToCoordinates(event.offsetX, event.offsetY, config)

  //use move to go throught the board
  board = move(x,y, board)
  //render the board
  render(board, config)
}

function handleRightClick(event){
  /*
    IN: event right click
    OUT: void
    DESC: based on mouse click recalculate table and render it and cell.flag
  */
  event.preventDefault()
  let [x,y] = pixelToCoordinates(event.offsetX, event.offsetY, config)
  let cell = board[y][x]
  if(!cell.shouldShow && !cell.reveal){
      cell.flag = !cell.flag
  }
  render(board, config)
}

function move(x,y, board){
  /*
    IN: x (integer), y (integer), board (2d array)
    OUT: board (2d array), contains cells (object) {mine: Boolean, Integer}
    DESC: recalculate board and show results of the event
  */
    let cell = board[y][x]

    // no ations are needed
    if(cell.flag || cell.shouldShow || cell.reveal) return board

    // lost game
    if(cell.mine){
      cell.shouldShow = true
      revealAll(board)
      return board
    }

    // show nearby use showNearbyCells
    if(!cell.nearbyMines) showNearbyCells(x,y,board)

    // show this cell only
    cell.shouldShow = true
    return board
}

function showNearbyCells(x,y, board){
  /*
    IN: x (integer), y (integer), board (2d array)
    OUT: board or void
    DESC: recrusivley check nearby cells and show them if empty
  */

  //use getNearbyCells from helper
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
    DESC: rset reveal all cell
  */
    board.forEach(function(row){
        row.forEach(function(cell){
            cell.reveal = true
        })
    })
}
