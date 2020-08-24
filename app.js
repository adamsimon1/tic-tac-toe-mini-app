class Game {
  constructor() {
    this.board = [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined]
    ];
    this.firstMoveX = true;
    this.xTurn = true;
    this.openSpaces = 9;
    this.xWinCount = 0;
    this.oWinCount = 0;
    this.drawCount = 0;
    this.isGameOver = false;
  }

  addX(row, col) {
    if (this.isGameOver) {
      return;
    }
    if (this.board[row][col] === undefined) {
      this.board[row][col] = 'x';
      this.xTurn = !this.xTurn;
      this.openSpaces--;
      $(`.row${row}.col${col}`).text('X');
      $(`.row${row}.col${col}`).css('color', 'black');
      if (this.checkBoard()) {
        console.log('modal should pop up indicating winner is X')
        this.xWinCount++;
        updateXTallyUI();
        this.isGameOver = true;
      } else if (this.openSpaces === 0) {
        console.log('draw')
        this.drawCount++;
        this.isGameOver = true;
        updateDrawTallyUI();
      }
    }
  }

  addO(row, col) {
    if (this.isGameOver) {
      return;
    }
    if (this.board[row][col] === undefined) {
      this.board[row][col] = 'o';
      this.xTurn = !this.xTurn
      this.openSpaces--;
      $(`.row${row}.col${col}`).text('O');
      $(`.row${row}.col${col}`).css('color', 'red');
      if (this.checkBoard()) {
        console.log('modal should pop up indicating winner is O')
        this.oWinCount++;
        updateOTallyUI();
        this.isGameOver = true;
      } else if (this.openSpaces === 0) {
        console.log('draw');
        this.drawCount++;
        this.isGameOver = true;
        updateDrawTallyUI();
      }
    }
  }

  checkRows() {
    for (let i = 0; i < 3; i++) {
      if (!this.board[i].includes('x') && !this.board[i].includes(undefined)) {
        return true;
      }
      if (!this.board[i].includes('o') && !this.board[i].includes(undefined)) {
        return true;
      }
    }
    return false;
  }

  checkCols() {
    for (let i = 0; i < 3; i++) {
      let col = this.board[0][i] + this.board[1][i] + this.board[2][i];
      if (col === 'xxx' || col === 'ooo') {
        return true;
      }
    }
    return false;
  }

  checkDiag() {
    let ltrDiag = this.board[0][0] + this.board[1][1] + this.board[2][2];
    let rtlDiag = this.board[0][2] + this.board[1][1] + this.board[2][0];
    return ltrDiag === 'ooo' || ltrDiag === 'xxx' || rtlDiag === 'xxx' || rtlDiag === 'ooo';
  }

  checkBoard() {
   return this.checkRows() || this.checkCols() || this.checkDiag();
  }

  resetGame() {
    this.board = [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined]
    ];
    this.xTurn = !this.firstMoveX;
    this.firstMoveX = !this.firstMoveX;
    this.openSpaces = 9;
    this.isGameOver = false;
    $('.item').text('');
  }
}

let currentGame = new Game();
$('.item').click(updateSquare);
$('#reset').click(resetTallyUI);
$('#exitBtn').click(exitModal);
$('.playAgain').click(function() {
  currentGame.resetGame();
  exitModal();
});

function updateSquare() {
  let row = $(this)[0].classList[0][3];
  let col = $(this)[0].classList[1][3];
  if (currentGame.xTurn) {
    currentGame.addX(row, col);
  } else {
    currentGame.addO(row, col);
  }
}

function updateXTallyUI() {
  $('#xWinCount').text(currentGame.xWinCount);
  showModal('X');
}

function updateOTallyUI() {
  $('#oWinCount').text(currentGame.oWinCount);
  showModal('O')
}

function updateDrawTallyUI() {
  $('#drawCount').text(currentGame.drawCount);
  showModal();
}

function resetTallyUI() {
  $('#xWinCount').text(0);
  $('#oWinCount').text(0);
  $('#drawCount').text(0);
  currentGame.xWinCount = 0;
  currentGame.oWinCount = 0;
  currentGame.drawCount = 0;
  currentGame.resetGame();
}

function showModal(winner) {
  $('#modal').slideDown(750);
  if (winner === 'X' || winner === 'O') {
    $('#Modal h2').text(`${winner} Wins the Game!`);
  } else {
    $('#Modal h2').text(`It's a Draw`)
  }
  let totalGamesPlayed = currentGame.xWinCount + currentGame.oWinCount + currentGame.drawCount;
  $('#xWinPercent').text(`${(currentGame.xWinCount / totalGamesPlayed * 100).toFixed(2)} %`)
  $('#oWinPercent').text(`${(currentGame.oWinCount / totalGamesPlayed * 100).toFixed(2)} %`)
  $('#drawPercent').text(`${(currentGame.drawCount / totalGamesPlayed * 100).toFixed(2)} %`)
}

function exitModal() {
  $('#modal').slideUp(750);
}