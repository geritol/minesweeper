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
      rowCount (integer), columnCount (integer), mineCountToGenerate (integer)
      -> board (2d array), contains cells (object) {mine: Boolean, Integer}
      Crerates a board, fills it with mines, and calculates nearby mine counts for cells
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
  const cellCount = rows * columns
  if(mineCountToGenerate > cellCount){
    throw new Error('More mines specified than cells!')
  }
  let mineCoordinates = []
  let mineCoordinatesIndex = {}
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
    const cell = board[rowIndex][columnIndex]
    if(cell.mine) return cell

    let nearbyMinesCount = 0

    getNearbyCells(rowIndex, columnIndex, board).forEach(function(cell){
        if(cell.mine) nearbyMinesCount += 1
    })

    cell.nearbyMines = nearbyMinesCount
    return cell
}

function handleClick(event){
  let [x,y] = pixelToCoordinates(event.offsetX, event.offsetY, config)
  board = move(x,y, board)
  render(board, config)
}

function handleRightClick(event){
  event.preventDefault()
  let [x,y] = pixelToCoordinates(event.offsetX, event.offsetY, config)
  let cell = board[y][x]
  if(!cell.shouldShow && !cell.reveal){
      cell.flag = !cell.flag
  }
  render(board, config)
}

function move(x,y, board){
    let cell = board[y][x]

    // no ations are needed
    if(cell.flag || cell.shouldShow || cell.reveal) return board

    // lost game
    if(cell.mine){
      cell.shouldShow = true
      revealAll(board)
      return board
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
