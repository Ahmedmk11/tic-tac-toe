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

    function drawMarker(event) {
        let cell = event.target
        let index = cell.id.split('-')[1]
        if (gameBoard.board[index] == '' && controller.state == 'ongoing'){
            playerMove(index, cell)
            controller.counter ++
            gameBoard.checkWin(player1)
            gameBoard.checkWin(player2)
            if (controller.state == 'ongoing' && currentPlayer.name == 'Hades' && controller.counter < 9) {
                hadesMove()
                controller.counter ++;
                gameBoard.checkWin(player2)

            }
        }
        console.log(controller.counter)
    }

    for (let i = 0; i < 9; i++) {
        node = document.getElementById(`cell-${i}`)
        node.addEventListener('click', drawMarker, true)
        cellNodes.push(node)
    }

    const playerMove = (index, cell) => {
        gameBoard.board[index] = currentPlayer.marker
        cell.textContent = currentPlayer.marker
        currentPlayer = (currentPlayer == player1) ? player2 : player1
    }

    const hadesMove = () => {
        let index = Math.floor(Math.random() * 9);
        while (gameBoard.board[index] !== '') {
            index = Math.floor(Math.random() * 9);
        }
        gameBoard.board[index] = currentPlayer.marker
        cellNodes[index].textContent = currentPlayer.marker
        currentPlayer = player1
    }

    return {
        player1,
        player2,
        cellNodes
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
        } else if (controller.counter == 9 && controller.state == 'ongoing') {
            controller.state = "It's a draw!"
        }
    }

    return {
        board,
        checkWin
    };
})();

const controller = (() => {
    const play = document.getElementById('play');
    const form = document.getElementById('form');
    let games = [];
    let state = 'none';
    let counter = 0;

    const mode = document.getElementById('player-type');
    const marker1 = document.getElementById('marker');
    const name1 = document.getElementById("p1-name");
    const name2 = document.getElementById("p2-name");
    const newGame = document.getElementById('new-game');

    const createGame = (modeVal, marker1Val, marker2Val, name1Val, name2Val) => {
        let mainGame = gameFactory(modeVal, marker1Val, marker2Val, name1Val, name2Val)
        games.push(mainGame)
        form.reset();
        form.classList.add("hidden")
        
    }

    mode.addEventListener('change', () => {
        if (mode.value == "human") {
            name2.classList.add('shown')
            name1.setAttribute("placeholder", "First Player")
        } else {
            name2.classList.remove('shown')
        }
    })
    
    play.addEventListener('click', () => {
        controller.state = 'ongoing'
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

        createGame(modeVal, marker1Val, marker2Val, name1Val, name2Val)
    });

    newGame.addEventListener('click', () => {
        const gameBoardDOM = document.getElementById("game-board")
        games[0].cellNodes.forEach(cell => {
            cell.removeEventListener('click', games[0].drawMarker, true)
            cell.textContent = ''
        });
        newBoard = gameBoardDOM.cloneNode(true)
        gameBoardDOM.parentNode.replaceChild(newBoard ,gameBoardDOM)

        delete games[0]
        games.pop()
        controller.state = 'none';
        controller.counter = 0;
        gameBoard.board = ['','','','','','','','',''];

        form.classList.remove("hidden");
    })

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
