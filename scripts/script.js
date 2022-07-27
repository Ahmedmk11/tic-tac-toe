// ----------------
// Global variables & Constants
// ----------------

// ----------------
// Modules
// ----------------

const gameBoard = (() => {
    let board = ['','','','','','','','',''];
    return {
        board
    };
})();

const mainGame = ((mode, marker1, marker2, name1, name2 = 'Hades') => {
    const player1 = playerFactory(name1, marker1)
    const player2 = (mode == 1) ? playerFactory(name2, marker2) : playerFactory("Hades", marker2, "AI")
    let currentPlayer = player1;
    
    let cellNodes = []
    for (let i = 1; i < 10; i++) {
        let node = document.getElementById(`cell-${i}`)
        cellNodes.push(node)
    }

    return {
        player1,
        player2
    };
})();

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
