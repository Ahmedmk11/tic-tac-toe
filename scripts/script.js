// ----------------
// Global variables & Constants
// ----------------

// ----------------
// Modules
// ----------------

const gameBoard = (() => {
    let board = ['','','','','','','','',''];
    return {

    };
})();

const mainGame = (() => {
    return {

    };
})();

// ----------------
// Objects & Factories
// ----------------

const playerFactory =  () => {

    return {};
};

const aiFactory =  () => {

    return {};
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
