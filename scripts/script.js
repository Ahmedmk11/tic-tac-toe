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
    let flag = true

    function drawMarker(event) {
        if (flag) {
            let cell = event.target
            let index = cell.id.split('-')[1]
            if (controller.boards[0].board[index] == '' && controller.state == 'ongoing'){
                controller.playerMove(index, cell)
                if (controller.state == 'ongoing' && controller.games[0].currentPlayer.name == 'Hades' && controller.counter < 9) { // ?
                    flag = false
                    setTimeout(function(){
                        controller.hadesMove();
                        flag = true
                    }, 400);
                }
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

    const checkWin = () => {
        if (board[0] == mainGame.player1.marker && board[1] == mainGame.player1.marker && board[2] == mainGame.player1.marker ||
        board[3] == mainGame.player1.marker && board[4] == mainGame.player1.marker && board[5] == mainGame.player1.marker ||
        board[6] == mainGame.player1.marker && board[7] == mainGame.player1.marker && board[8] == mainGame.player1.marker ||
        board[0] == mainGame.player1.marker && board[4] == mainGame.player1.marker && board[8] == mainGame.player1.marker ||
        board[2] == mainGame.player1.marker && board[4] == mainGame.player1.marker && board[6] == mainGame.player1.marker ||
        board[0] == mainGame.player1.marker && board[3] == mainGame.player1.marker && board[6] == mainGame.player1.marker ||
        board[1] == mainGame.player1.marker && board[4] == mainGame.player1.marker && board[7] == mainGame.player1.marker ||
        board[2] == mainGame.player1.marker && board[5] == mainGame.player1.marker && board[8] == mainGame.player1.marker) {
            controller.score1 ++;
            controller.displayEndMatch(`${mainGame.player1.name} Won!`)
        } else if (board[0] == mainGame.player2.marker && board[1] == mainGame.player2.marker && board[2] == mainGame.player2.marker ||
        board[3] == mainGame.player2.marker && board[4] == mainGame.player2.marker && board[5] == mainGame.player2.marker ||
        board[6] == mainGame.player2.marker && board[7] == mainGame.player2.marker && board[8] == mainGame.player2.marker ||
        board[0] == mainGame.player2.marker && board[4] == mainGame.player2.marker && board[8] == mainGame.player2.marker ||
        board[2] == mainGame.player2.marker && board[4] == mainGame.player2.marker && board[6] == mainGame.player2.marker ||
        board[0] == mainGame.player2.marker && board[3] == mainGame.player2.marker && board[6] == mainGame.player2.marker ||
        board[1] == mainGame.player2.marker && board[4] == mainGame.player2.marker && board[7] == mainGame.player2.marker ||
        board[2] == mainGame.player2.marker && board[5] == mainGame.player2.marker && board[8] == mainGame.player2.marker) {
            controller.score2 ++;
            controller.displayEndMatch(`${mainGame.player2.name} Won!`)
        }else if (controller.counter == 9 && controller.state == 'ongoing') {
            controller.displayEndMatch("It's a tie!")
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
    const newGame = document.getElementById('new-game');
    const newRound = document.getElementById('new-round');
    const btnContainer = document.getElementById('btn-container');

    let round = 1;
    let score1 = 0;
    let score2 = 0;
    let counter = 0;
    let games = [];
    let boards = [];
    let modeVal = '';
    let marker1Val = '';
    let marker2Val = '';
    let name1Val = '';
    let name2Val = 'Hades';
    let state = 'none';

    let gameBoardDOM = document.getElementById("game-board")
    const mode = document.getElementById('player-type');
    const marker1 = document.getElementById('marker');
    const name1 = document.getElementById("p1-name");
    const name2 = document.getElementById("p2-name");
    const name2Container = document.getElementById("name2-container");
    const p1Label = document.getElementById('p1-label');
    const text = document.getElementById('final-text');
    const p1ScoreName = document.getElementById('p1-score-name');
    const p1ScoreValue = document.getElementById('p1-score-value');
    const p2ScoreName = document.getElementById('p2-score-name');
    const p2ScoreValue = document.getElementById('p2-score-value');
    const scoreboard = document.querySelectorAll('.scoreboard');

    const displayEndMatch = (state) => {
        btnContainer.classList.remove("hidden");
        text.classList.remove("hidden");
        controller.state = state;
        text.innerHTML = state;
        p1ScoreValue.textContent = controller.score1;
        p2ScoreValue.textContent = controller.score2;
    }

    const createGame = (modeVal, marker1Val, marker2Val, name1Val, name2Val) => {
        let mainGame = gameFactory(modeVal, marker1Val, marker2Val, name1Val, name2Val)
        let board = gameBoardFactory(mainGame)
        games.push(mainGame)
        boards.push(board)
        form.reset();

        form.classList.add("hidden")
        play.classList.add("hidden")
        gameBoardDOM.classList.remove("hidden")
        scoreboard.forEach(element => {
            element.classList.remove("hidden")
        });
    }

    const playerMove = (index, cell) => {
        boards[0].board[index] = games[0].currentPlayer.marker

        let marker = document.createElement('img')
        marker.setAttribute('src', `images/${games[0].currentPlayer.marker}.png`)
        cell.appendChild(marker) 
        $(marker).hide().fadeIn()

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

        let marker = document.createElement('img')
        marker.setAttribute('src', `images/${games[0].currentPlayer.marker}.png`)
        games[0].cellNodes[index].appendChild(marker)
        $(marker).hide().fadeIn()

        games[0].currentPlayer = games[0].player1
        controller.counter ++
        boards[0].checkWin()
    }

    mode.addEventListener('change', () => {
        if (mode.value == "human") {
            name2Container.classList.add('shown')
            name1.setAttribute("placeholder", "First Player")
            p1Label.innerHTML = 'First Player:'
        } else {
            name2Container.classList.remove('shown')
            name1.setAttribute("placeholder", "Player Name")
            p1Label.innerHTML = 'Player Name:'
        }
    })
    
    play.addEventListener('click', () => {
        if (mode.reportValidity() && marker1.reportValidity() && name1.reportValidity() && (mode.value == "computer" || name2.reportValidity())) {
            controller.state = 'ongoing'
            modeVal = '';
            marker1Val = marker1.value;
            marker2Val = (marker1.value == 'x') ? 'o' : 'x'
            name1Val = name1.value;
            name2Val = 'Hades'
            if (mode.value == 'human') {
                name2Val = name2.value;
                modeVal = 1;
            } else {
                modeVal = 2;
            }
            createGame(modeVal, marker1Val, marker2Val, name1Val, name2Val)
            
            p1ScoreName.textContent = name1Val;
            p2ScoreName.textContent = name2Val;
            p1ScoreValue.textContent = 0;
            p2ScoreValue.textContent = 0;

            if (controller.counter == 0 && name2Val === '' && marker1Val === 'o') {
                hadesMove()
            }
        }
    });

    newGame.addEventListener('click', () => {
        games[0].cellNodes.forEach(cell => {
            cell.removeEventListener('click', games[0].drawMarker, true)
            cell.textContent = ''
        });
        newBoard = gameBoardDOM.cloneNode(true)
        gameBoardDOM.parentNode.replaceChild(newBoard ,gameBoardDOM)
        gameBoardDOM = newBoard

        delete games[0]
        delete boards[0]
        games.pop()
        boards.pop()
        controller.state = 'none';
        controller.counter = 0;
        controller.round = 1;
        controller.score1 = 0;
        controller.score2 = 0;

        btnContainer.classList.add("hidden");
        text.innerHTML = '';
        text.classList.add("hidden");
        gameBoardDOM.classList.add("hidden");
        play.classList.remove("hidden");
        form.classList.remove("hidden");
        scoreboard.forEach(element => {
            element.classList.add("hidden")
        });
    });

    newRound.addEventListener('click', () => {
        controller.round ++;
        console.log(controller.round, controller.score1, controller.score2)
        games[0].cellNodes.forEach(cell => {
            cell.removeEventListener('click', games[0].drawMarker, true)
            cell.textContent = ''
        });
        newBoard = gameBoardDOM.cloneNode(true)
        gameBoardDOM.parentNode.replaceChild(newBoard ,gameBoardDOM)
        gameBoardDOM = newBoard

        delete games[0]
        delete boards[0]
        games.pop()
        boards.pop()
        controller.state = 'none';
        controller.counter = 0;

        btnContainer.classList.add("hidden");
        text.innerHTML = '';
        text.classList.add("hidden");
        controller.state = 'ongoing'

        createGame(modeVal, marker1Val, marker2Val, name1Val, name2Val)
        if (controller.counter == 0 && name2Val === '' && marker1Val === 'o') {
            hadesMove()
        }
    });

    return {
        games,
        boards,
        state,
        counter,
        hadesMove,
        playerMove,
        displayEndMatch,
        round,
        score1,
        score2
    }
})();

// ----------------
// Footer
// ---------------- 

let currentYear = new Date().getFullYear(); 
let startYr = document.getElementById("starting-year").textContent;

if (startYr != currentYear){
    document.getElementById("current-year").textContent = `-${currentYear}`;
}
