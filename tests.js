var showDetails = true

chai.should()

const testFunctions = [testGenerateNewBoard]

// test boundle, testing generate new board
function testGenerateNewBoard(){
  function emptyBoard(){
    let board = generateNewBoard(0, 0, 0)
    board.should.be.an('array').that.is.empty
  }
  function moreMinesThanFieds(){
    try{
      let board = generateNewBoard(0, 0, 1)
    }catch(err) {
      return
    }
    throw new Error('Expecting error if more mines than cells!')
  }
  function someBoard(){
    let board = generateNewBoard(9, 10, 90)
    board.should.be.an('array')
    board.should.have.lengthOf(9)
    board.forEach((row)=>{
      row.should.have.lengthOf(10)
      row.forEach((cell)=>{
        cell.should.not.be.empty
      })
    })
  }
  return runTests([emptyBoard, moreMinesThanFieds, someBoard])
}

// takes care of running the tests of test bundles
function runTests(testList){
  let res = {
    message: 'Test for generateNewBoard()',
    passCount: 0,
    totalCount: 0
  }
  testList.forEach((fn)=>{
    res.totalCount += 1
    try{
      fn()
      res.passCount += 1
    }catch(err){
      if(showDetails) console.log(err)
    }
  })
  return res
}

// runs the test bundles
(function testRunner(){
  testFunctions.forEach((fn) => {
    colors = {
      'pass': 'green',
      'fail': 'red'
    }
    // res = {message: '', passCount, totalCount}
    res = fn()
    result = res.totalCount - res.passCount === 0? 'pass' : 'fail'
    console.log(`%c ${res.message} (${res.passCount}/${res.totalCount})`, `color: ${colors[result]}`);
  })
})()
