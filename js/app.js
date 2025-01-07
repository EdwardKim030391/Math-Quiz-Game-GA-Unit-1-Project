// HTML Elements
const difficultyDiv = document.getElementById('difficulty');
const gameDiv = document.getElementById('game');
const restartBtn = document.getElementById('restart');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const questionDisplay = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitBtn = document.getElementById('submit');
const messageDisplay = document.getElementById('message');
const characterImg = document.getElementById('character-img');
const cookieContainer = document.getElementById('cookie-container');

// Variables
let difficulty = 'easy';
let timer;
let time = 90;
let score = 0;
let currentCookieIndex = 0;
let currentAnswer = null;
let cookies = [];
let winScore = 10;

// Functions
function initGame() {
    difficultyDiv.style.display = 'none';
    gameDiv.style.display = 'block';
    restartBtn.style.display = 'none';
    messageDisplay.textContent = '';
    characterImg.src = './image/crayon.JPG';
    cookieContainer.innerHTML = '';
    cookies = [];

    for (let i = 0; i < winScore; i++) {
        const cookie = document.createElement('img');
        cookie.src = './image/cookie.JPG';
        cookie.classList.add('cookie');
        cookieContainer.appendChild(cookie);
        cookies.push(cookie);
    }

    time = 90;
    score = 0;
    currentCookieIndex = 0;
    updateScore();
    updateTimer();
    startTimer();
    generateQuestion();
}

function startTimer() {
    timer = setInterval(() => {
        time--;
        updateTimer();
        if (time <= 0) {
            clearInterval(timer);
            endGame(false);
        }
    }, 1000);
}

function updateTimer() {
    timerDisplay.textContent = `Time: ${time}s`;
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function generateQuestion() {
    const [min, max] = getNumberRange();
    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let question;
    if (operator === '/') {
        question = `${num1 * num2} / ${num2}`;
        currentAnswer = num1;
    } else {
        question = `${num1} ${operator} ${num2}`;
        currentAnswer = Math.round(eval(question) * 100) / 100;
    }

    questionDisplay.textContent = `Question: ${question}`;
}

function getNumberRange() {
    if (difficulty === 'easy') return [1, 10];
    if (difficulty === 'medium') return [10, 50];
    if (difficulty === 'hard') return [50, 100];
}

function checkAnswer() {
    const userAnswer = parseFloat(answerInput.value.trim());
    if (Math.abs(userAnswer - currentAnswer) < 0.001) {
        score++;
        updateScore();
        if (currentCookieIndex < cookies.length) {
            const currentCookie = cookies[currentCookieIndex];
            currentCookie.classList.add('eaten');
            currentCookieIndex++;
        }
        characterImg.src = './image/happycrayon.JPG';
        checkWinCondition();
    } else {
        characterImg.src = './image/sadcrayon.JPG';
    }
    answerInput.value = '';
    generateQuestion();
}

function checkWinCondition() {
    if (score >= winScore) {
        clearInterval(timer);
        messageDisplay.textContent = 'You Win!';
        restartBtn.style.display = 'block';
        gameDiv.style.display = 'none';
    }
}

function endGame(win) {
    clearInterval(timer);
    messageDisplay.textContent = win ? 'You Win!' : 'Time\'s Up! You Lose!';
    restartBtn.style.display = 'block';
    gameDiv.style.display = 'none';
}

// Event Listeners
document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        difficulty = e.target.dataset.difficulty;
        initGame();
    });
});

submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

restartBtn.addEventListener('click', () => {
    difficultyDiv.style.display = 'block';
    gameDiv.style.display = 'none';
    restartBtn.style.display = 'none';
});
