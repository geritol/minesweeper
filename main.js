'use strict'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

let rows = 10
let columns = 20
const cellSize = 30
const separatorLineThickness = 2
let width = cellSize * columns + separatorLineThickness * (columns + 1)
let height = cellSize * rows + separatorLineThickness * (rows + 1)

canvas.height = height
canvas.width = width 

function generateNewBoard(rows, columns, mines){
    let board = range(rows).map(function(){return range(columns).map(function(){return {}})})   
    let mineCoordinates = []
    let mineCoordinatesIndex = {}
    while(mineCoordinates.length < mines){
        let x = Math.floor(Math.random() * columns)
        let y = Math.floor(Math.random() * rows)
        if(!mineCoordinatesIndex[String([x,y])]){
            mineCoordinatesIndex[String([x,y])] = 1
            mineCoordinates.push([x,y])
            board[y][x].mine = true
        }
    }
    return board 
}

function range(i){
    return Array.apply(null, Array(i)).map(function (_, j) {return j;});
}
let board = generateNewBoard(rows, columns, 30)
console.log(board)
render(board)