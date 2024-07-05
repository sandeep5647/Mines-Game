let board = [];
let rows = 5;
let cols = 5;
let mineCount = 3;
let score = 0;

let diamondSound = new Audio('diamond.mp3');
let mineSound = new Audio('explosion.wav');

function initGame() {
    mineCount = parseInt(document.getElementById('mineCount').value);
    board = [];
    document.getElementById('gameBoard').innerHTML = '';
    document.getElementById('gameBoard').style.gridTemplateColumns = `repeat(${cols}, 50px)`;
    score = 0;
    updateScore();

    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < cols; c++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', revealCell);
            cell.addEventListener('touchstart', revealCell); // Add touch event listener
            board[r][c] = {mine: false, revealed: false, element: cell};
            document.getElementById('gameBoard').appendChild(cell);
        }
    }

    placeMines();
}

function placeMines() {
    let placedMines = 0;
    while (placedMines < mineCount) {
        let row = Math.floor(Math.random() * rows);
        let col = Math.floor(Math.random() * cols);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            placedMines++;
        }
    }
}

function revealCell(event) {
    event.preventDefault(); // Prevent default behavior for touch events
    let row = parseInt(this.dataset.row);
    let col = parseInt(this.dataset.col);

    if (board[row][col].revealed) return;

    board[row][col].revealed = true;
    this.classList.add('revealed');

    if (board[row][col].mine) {
        this.classList.add('mine');
        this.innerHTML = '<img src="./mines.png" alt="Mine">';
        
        gameOver();
        mineSound.play(); // Play mine sound effect
        return;
    }

    this.classList.add('safe');
    this.innerHTML = '<img src="./gem.png" alt="Diamond">';
    diamondSound.play(); // Play diamond sound effect
    score++;
    updateScore();

    if (score === rows * cols - mineCount) {
        alert("You win!");
        initGame();
    }
}

function gameOver() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!board[r][c].revealed) {
                board[r][c].revealed = true;
                board[r][c].element.classList.add('revealed');
                if (board[r][c].mine) {
                    board[r][c].element.classList.add('mine');
                    board[r][c].element.innerHTML = '<img src="./mines.png" alt="Mine">';
                    
                } else {
                    board[r][c].element.classList.add('safe');
                    board[r][c].element.innerHTML = '<img src="./gem.png" alt="Diamond">';
                }
            }
            board[r][c].element.removeEventListener('click', revealCell);
            board[r][c].element.removeEventListener('touchstart', revealCell); // Remove touch event listener
        }
    }
    setTimeout(initGame, 5000); // Restart game after 2 seconds
}

function updateScore() {
    document.getElementById('scoreBoard').innerText = `Score: ${score}`;
}

initGame();
