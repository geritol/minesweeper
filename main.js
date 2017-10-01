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

let board = range(rows).map(function(){return range(columns).fill({})})

function range(i){
    return Array.apply(null, Array(i)).map(function (_, j) {return j;});
}

function render(board){
    range(rows + 1).map(function(i){
        let nextStartingYCoordinate = cellSize * i + separatorLineThickness * i
        context.fillRect(0,nextStartingYCoordinate, width, separatorLineThickness)
    })
    range(columns + 1).map(function(i){
        let nextStartingXCoordinate = cellSize * i + separatorLineThickness * i
        context.fillRect(nextStartingXCoordinate, 0, separatorLineThickness, height)
    })
    board.forEach(function(row, i) {
       
    });
}
console.log(board)
render(board)