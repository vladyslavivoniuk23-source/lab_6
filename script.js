let currentGrid = [];
let levelsData = [];
let currentLevelIndex = 0; // Зберігаємо поточний рівень
let moveCount = 0;        // Лічильник ходів

async function init() {
    const response = await fetch('data/levels.json');
    const data = await response.json();
    levelsData = data.levels;
    loadLevel(0);
}

function loadLevel(index) {
    currentLevelIndex = index;
    moveCount = 0; // Скидаємо лічильник при завантаженні рівня
    currentGrid = JSON.parse(JSON.stringify(levelsData[index].grid));
    
    // Оновлюємо UI статистики
    document.getElementById('move-count').textContent = moveCount;
    
    // Змінено: звертаємось до властивості .steps з вашого JSON
    document.getElementById('target-moves').textContent = levelsData[index].steps || 0; 
    
    document.getElementById('status').textContent = "";
    
    render();
}
function resetLevel() {
    loadLevel(currentLevelIndex); // Перезавантажуємо поточний рівень
}

function toggle(r, c) {
    if (r >= 0 && r < 5 && c >= 0 && c < 5) {
        currentGrid[r][c] = currentGrid[r][c] === 1 ? 0 : 1;
    }
}

function handleCellClick(r, c) {
    // Не дозволяємо грати після перемоги, поки рівень не скинуто
    const isWin = currentGrid.every(row => row.every(cell => cell === 0));
    if (isWin) return;

    toggle(r, c);
    toggle(r - 1, c);
    toggle(r + 1, c);
    toggle(r, c - 1);
    toggle(r, c + 1);
    
    // Інкремент та оновлення лічильника
    moveCount++;
    document.getElementById('move-count').textContent = moveCount;
    
    render();
    checkWin();
}

function render() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            const cell = document.createElement('div');
            cell.className = `cell ${currentGrid[r][c] === 1 ? 'on' : 'off'}`;
            cell.onclick = () => handleCellClick(r, c);
            board.appendChild(cell);
        }
    }
}

function checkWin() {
    const win = currentGrid.every(row => row.every(cell => cell === 0));
    if (win) {
        document.getElementById('status').textContent = `Ви перемогли за ${moveCount} ходів!`;
    }
}

init();
