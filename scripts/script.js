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
    let currentPlayer = (marker1 == 'x') ? player1 : player2
    let node = ''
    let cellNodes = []

    function drawMarker(event) {
        let cell = event.target
        let index = cell.id.split('-')[1]
        if (controller.boards[0].board[index] == '' && controller.state == 'ongoing'){
            controller.playerMove(index, cell)
            if (controller.state == 'ongoing' && controller.games[0].currentPlayer.name == 'Hades' && controller.counter < 9) { // ?
                controller.hadesMove()
            }
        }
    }

    for (let i = 0; i < 9; i++) {
        node = document.getElementById(`cell-${i}`)
        node.addEventListener('click', drawMarker, true)
        cellNodes.push(node)
    }

    return {
        player1,
        player2,
        cellNodes,
        currentPlayer
    };
};

const gameBoardFactory = (mainGame) => {
    let board = ['','','','','','','','',''];
    const newGame = document.getElementById('new-game');

    const checkWin = () => {
        if (board[0] == mainGame.player1.marker && board[1] == mainGame.player1.marker && board[2] == mainGame.player1.marker ||
        board[3] == mainGame.player1.marker && board[4] == mainGame.player1.marker && board[5] == mainGame.player1.marker ||
        board[6] == mainGame.player1.marker && board[7] == mainGame.player1.marker && board[8] == mainGame.player1.marker ||
        board[0] == mainGame.player1.marker && board[4] == mainGame.player1.marker && board[8] == mainGame.player1.marker ||
        board[2] == mainGame.player1.marker && board[4] == mainGame.player1.marker && board[6] == mainGame.player1.marker ||
        board[0] == mainGame.player1.marker && board[3] == mainGame.player1.marker && board[6] == mainGame.player1.marker ||
        board[1] == mainGame.player1.marker && board[4] == mainGame.player1.marker && board[7] == mainGame.player1.marker ||
        board[2] == mainGame.player1.marker && board[5] == mainGame.player1.marker && board[8] == mainGame.player1.marker) {
            controller.state = `${mainGame.player1.name} Won!`
            newGame.classList.remove("hidden")
        } else if (board[0] == mainGame.player2.marker && board[1] == mainGame.player2.marker && board[2] == mainGame.player2.marker ||
        board[3] == mainGame.player2.marker && board[4] == mainGame.player2.marker && board[5] == mainGame.player2.marker ||
        board[6] == mainGame.player2.marker && board[7] == mainGame.player2.marker && board[8] == mainGame.player2.marker ||
        board[0] == mainGame.player2.marker && board[4] == mainGame.player2.marker && board[8] == mainGame.player2.marker ||
        board[2] == mainGame.player2.marker && board[4] == mainGame.player2.marker && board[6] == mainGame.player2.marker ||
        board[0] == mainGame.player2.marker && board[3] == mainGame.player2.marker && board[6] == mainGame.player2.marker ||
        board[1] == mainGame.player2.marker && board[4] == mainGame.player2.marker && board[7] == mainGame.player2.marker ||
        board[2] == mainGame.player2.marker && board[5] == mainGame.player2.marker && board[8] == mainGame.player2.marker) {
            controller.state = `${mainGame.player2.name} Won!`
            newGame.classList.remove("hidden")            
        }else if (controller.counter == 9 && controller.state == 'ongoing') {
            controller.state = "It's a draw!"
            newGame.classList.remove("hidden")
        }
    }

    return {
        board,
        checkWin
    };
};

// ----------------
// Modules
// ----------------

const controller = (() => {
    const play = document.getElementById('play');
    const form = document.getElementById('form');
    let games = [];
    let boards = [];
    let state = 'none';
    let counter = 0;

    const mode = document.getElementById('player-type');
    const marker1 = document.getElementById('marker');
    const name1 = document.getElementById("p1-name");
    const name2 = document.getElementById("p2-name");
    const newGame = document.getElementById('new-game');

    const createGame = (modeVal, marker1Val, marker2Val, name1Val, name2Val) => {
        let mainGame = gameFactory(modeVal, marker1Val, marker2Val, name1Val, name2Val)
        let board = gameBoardFactory(mainGame)
        games.push(mainGame)
        boards.push(board)
        form.reset();
        form.classList.add("hidden")
        play.classList.add("hidden")
    }

    const playerMove = (index, cell) => {
        boards[0].board[index] = games[0].currentPlayer.marker
        cell.textContent = games[0].currentPlayer.marker
        games[0].currentPlayer = (games[0].currentPlayer == games[0].player1) ? games[0].player2 : games[0].player1
        controller.counter ++
        boards[0].checkWin()
    }

    const hadesMove = () => {
        let index = Math.floor(Math.random() * 9);
        while (boards[0].board[index] !== '') {
            index = Math.floor(Math.random() * 9);
        }
        boards[0].board[index] = games[0].currentPlayer.marker
        games[0].cellNodes[index].textContent = games[0].currentPlayer.marker
        games[0].currentPlayer = games[0].player1
        controller.counter ++
        boards[0].checkWin()
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
        if (mode.reportValidity() && marker1.reportValidity() && name1.reportValidity() && (mode.value == "computer" || name2.reportValidity())) {
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
            if (controller.counter == 0 && name2Val === '' && marker1Val === 'o') {
                hadesMove()
            }
        }
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
        delete boards[0]
        games.pop()
        boards.pop()
        controller.state = 'none';
        controller.counter = 0;
        form.classList.remove("hidden");
        play.classList.remove("hidden");
        newGame.classList.add("hidden");
    })

    return {
        games,
        boards,
        state,
        counter,
        hadesMove,
        playerMove
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
