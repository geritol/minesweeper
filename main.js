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
        context.fillStyle = '#808080'
        context.fillRect(0,nextStartingYCoordinate, width, separatorLineThickness)
    })
    range(columns + 1).map(function(i){
        let nextStartingXCoordinate = cellSize * i + separatorLineThickness * i
        context.fillStyle = '#808080'        
        context.fillRect(nextStartingXCoordinate, 0, separatorLineThickness, height)
    })
    board.forEach(function(row, i) {
       row.forEach(function(cell, j){
           fillCell(j, i, '#bdbdbd')
       })
    });
}

function drawMine(x,y){
    let mineImage = document.getElementById('mine')
    let xPx = cellSize * x + separatorLineThickness * (x + 1)
    let yPx = cellSize * y + separatorLineThickness * (y + 1)
    fillCell(x,y, 'red')
    context.drawImage(mineImage,xPx,yPx, cellSize, cellSize);
}

function drawFlag(x,y){
    let flagImage = document.getElementById('flag')
    let xPx = cellSize * x + separatorLineThickness * (x + 1)
    let yPx = cellSize * y + separatorLineThickness * (y + 1)
    context.drawImage(flagImage,xPx,yPx, cellSize, cellSize);
}

function fillCell(x,y, color){
    let topLeft = []
    let xPx = cellSize * x + separatorLineThickness * (x + 1)
    let yPx = cellSize * y + separatorLineThickness * (y + 1)
    context.fillStyle = color;     
    context.fillRect(xPx, yPx, cellSize, cellSize)
}

function drawNumber(x,y, num){
    let xPx = cellSize * x + separatorLineThickness * (x + 1)
    let yPx = cellSize * y + separatorLineThickness * (y + 1)

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
    
    context.fillText(num , xPx + cellSize/2 - (textWidth / 2), yPx + cellSize/4*3 );
}


console.log(board)
render(board)