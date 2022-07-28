// ----------------
// Global variables & Constants
// ----------------

// ----------------
// Objects & Factories
// ----------------

const playerFactory =  (name, marker, type = "human") => {
    if (type !== "human") {
        name = "Hades"
    }
    return {
        name,
        marker
    };
};

const gameFactory = (mode, marker1, marker2, name1, name2 = 'Hades') => {
    const player1 = playerFactory(name1, marker1)
    const player2 = (mode == 1) ? playerFactory(name2, marker2) : playerFactory("Hades", marker2, "AI")
    let currentPlayer = player1;
    let node = ''
    let cellNodes = []

    const drawMarker = (event) => {
        let cell = event.target
        let index = cell.id.split('-')[1]
        if (gameBoard.board[index] == '' && controller.state == 'ongoing'){
            playerMove(index, cell)
            if (currentPlayer == 'hades') {
                hadesMove()
            }
            controller.counter ++;
        }
        gameBoard.checkWin(player1)
        gameBoard.checkWin(player2)
    }

    for (let i = 0; i < 9; i++) {
        node = document.getElementById(`cell-${i}`)
        node.addEventListener('click', (event) => drawMarker(event))
        cellNodes.push(node)
    }

    const playerMove = (index, cell) => {
        gameBoard.board[index] = currentPlayer.marker
        cell.textContent = currentPlayer.marker
        currentPlayer = (currentPlayer == player1) ? player2 : player1
    }

    const hadesMove = () => {
        index = Math.floor(Math.random() * 9);
        gameBoard.board[index] = currentPlayer.marker
        cellNodes[index].textContent = currentPlayer.marker
        currentPlayer = player1
    }

    return {
        player1,
        player2
    };
};

// ----------------
// Modules
// ----------------

const gameBoard = (() => {
    let board = ['','','','','','','','',''];
    const checkWin = (player) => {
        if (board[0] == player.marker && board[1] == player.marker && board[2] == player.marker ||
        board[3] == player.marker && board[4] == player.marker && board[5] == player.marker ||
        board[6] == player.marker && board[7] == player.marker && board[8] == player.marker ||
        board[0] == player.marker && board[4] == player.marker && board[8] == player.marker ||
        board[2] == player.marker && board[4] == player.marker && board[6] == player.marker ||
        board[0] == player.marker && board[3] == player.marker && board[6] == player.marker ||
        board[1] == player.marker && board[4] == player.marker && board[7] == player.marker ||
        board[2] == player.marker && board[5] == player.marker && board[8] == player.marker) {
            controller.state = `${player.name} Won!`
        } else if (controller.counter == 9) {
            controller.state = "It's a draw!"
        }
    }

    return {
        board,
        checkWin
    };
})();

const controller = (() => {
    const submit = document.getElementById('submit');
    let games = []
    let state = 'ongoing'
    let counter = 0

    let mode = document.getElementById('player-type');
    let marker1 = document.getElementById('marker');
    let name1 = document.getElementById("p1-name");
    let name2 = document.getElementById("p2-name");

    mode.addEventListener('change', () => {
        if (mode.value == "human") {
            name2.classList.add('shown')
            name1.setAttribute("placeholder", "First Player")
        } else {
            name2.classList.remove('shown')
        }
    })
    
    submit.addEventListener('click', () => {
        let modeVal = '';
        let marker1Val = marker1.value;
        let marker2Val = (marker1.value == 'x') ? 'o' : 'x'
        let name1Val = name1.value;
        let name2Val = ''

        if (mode.value == 'human') {
            name2Val = name2.value;
            modeVal = 1;
        } else {
            modeVal = 2;
        }
        let mainGame = gameFactory(modeVal, marker1Val, marker2Val, name1Val, name2Val)
        games.push(mainGame)
    });

    return {
        games,
        state,
        counter
    }
})();

// ----------------
// Functions
// ----------------

function setTheme() {
    const root = document.documentElement;
    const newTheme = root.className === 'dark' ? 'light' : 'dark';
    root.className = newTheme;
}

// ----------------
// Copyright year
// ---------------- 

let currentYear = new Date().getFullYear(); 
let startYr = document.getElementById("starting-year").textContent;

if (startYr != currentYear){
    document.getElementById("current-year").textContent = `-${currentYear}`;
}
